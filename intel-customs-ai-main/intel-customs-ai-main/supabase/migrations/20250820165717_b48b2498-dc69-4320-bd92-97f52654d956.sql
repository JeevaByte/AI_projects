-- Create enum types for better data integrity
CREATE TYPE document_status AS ENUM ('UPLOADED', 'PARSING', 'PARSED', 'CLASSIFYING', 'CLASSIFIED', 'CALCULATING', 'COMPLETED', 'FAILED', 'PENDING_REVIEW');
CREATE TYPE compliance_rule_type AS ENUM ('FTA', 'BIS', 'FSSAI', 'CBIC', 'ANTI_DUMPING', 'SAFEGUARD');
CREATE TYPE user_role AS ENUM ('ADMIN', 'REVIEWER', 'OPERATOR');

-- Core documents table
CREATE TABLE public.documents (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    original_filename TEXT NOT NULL,
    original_file_path TEXT,
    file_size BIGINT,
    mime_type TEXT,
    extracted_text TEXT,
    ocr_confidence_score DECIMAL(5,2),
    upload_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    processing_started_at TIMESTAMP WITH TIME ZONE,
    processing_completed_at TIMESTAMP WITH TIME ZONE,
    status document_status NOT NULL DEFAULT 'UPLOADED',
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Knowledge base articles for RAG
CREATE TABLE public.kb_articles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content_text TEXT NOT NULL,
    source_url TEXT,
    source_type TEXT, -- 'CBIC', 'WCO', 'GAZETTE', 'CIRCULAR'
    effective_from DATE,
    effective_to DATE,
    embedding VECTOR(384), -- For semantic search
    keywords TEXT[], -- For keyword search
    hs_codes_mentioned TEXT[], -- Related HS codes
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Rules for duty calculation
CREATE TABLE public.rules (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    hs_code_prefix TEXT NOT NULL, -- '8708', '870830', etc.
    description TEXT NOT NULL,
    bcd_rate DECIMAL(5,2) DEFAULT 0, -- Basic Customs Duty
    igst_rate DECIMAL(5,2) DEFAULT 0, -- Integrated GST
    cess_rate DECIMAL(5,2) DEFAULT 0, -- Additional cess
    sw_cess_rate DECIMAL(5,2) DEFAULT 0, -- Social Welfare Cess
    exemption_notification TEXT, -- Notification number if exempted
    exemption_conditions JSONB DEFAULT '{}',
    effective_from DATE NOT NULL,
    effective_to DATE,
    country_of_origin TEXT[], -- Applicable countries
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- AI classifications
CREATE TABLE public.classifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    predicted_hs_code TEXT NOT NULL,
    confidence DECIMAL(5,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
    alternative_codes JSONB DEFAULT '[]', -- Top 3 alternatives with scores
    llm_model_used TEXT NOT NULL,
    prompt_template_version TEXT,
    processing_time_ms INTEGER,
    is_reviewed_by_human BOOLEAN DEFAULT FALSE,
    reviewed_by UUID,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    human_override_code TEXT, -- If human reviewer changes the code
    review_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Duty calculations
CREATE TABLE public.duties (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    classification_id UUID NOT NULL REFERENCES public.classifications(id) ON DELETE CASCADE,
    rule_id UUID NOT NULL REFERENCES public.rules(id),
    assessable_value DECIMAL(15,2) NOT NULL,
    bcd_value DECIMAL(15,2) DEFAULT 0,
    igst_value DECIMAL(15,2) DEFAULT 0,
    cess_value DECIMAL(15,2) DEFAULT 0,
    sw_cess_value DECIMAL(15,2) DEFAULT 0,
    total_duty_value DECIMAL(15,2) NOT NULL,
    exemption_applied BOOLEAN DEFAULT FALSE,
    exemption_amount DECIMAL(15,2) DEFAULT 0,
    calculation_details JSONB DEFAULT '{}', -- Step-by-step breakdown
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Compliance rules and checks
CREATE TABLE public.compliance_rules (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    rule_type compliance_rule_type NOT NULL,
    rule_name TEXT NOT NULL,
    description TEXT,
    hs_code_applicability TEXT[], -- HS codes this rule applies to
    country_applicability TEXT[], -- Countries this rule applies to
    required_documents TEXT[], -- Required document types
    conditions JSONB DEFAULT '{}', -- Complex conditions
    penalty_if_violated TEXT,
    reference_notification TEXT,
    effective_from DATE NOT NULL,
    effective_to DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Compliance check results
CREATE TABLE public.compliance_checks (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    compliance_rule_id UUID NOT NULL REFERENCES public.compliance_rules(id),
    status TEXT NOT NULL, -- 'PASS', 'FAIL', 'WARNING', 'PENDING'
    details TEXT,
    required_action TEXT,
    checked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Audit trail for explainability
CREATE TABLE public.audit_trails (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    step_name TEXT NOT NULL, -- 'PARSING', 'CLASSIFICATION', 'DUTY_CALC', 'COMPLIANCE'
    input_data JSONB,
    output_data JSONB,
    confidence_scores JSONB,
    source_snippets TEXT[],
    kb_articles_used UUID[],
    rules_applied UUID[],
    processing_time_ms INTEGER,
    model_version TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User profiles for authentication
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    full_name TEXT,
    email TEXT,
    role user_role NOT NULL DEFAULT 'OPERATOR',
    department TEXT,
    last_login_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kb_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.duties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_trails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for documents (users can only see their own)
CREATE POLICY "Users can view their own documents" ON public.documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own documents" ON public.documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own documents" ON public.documents FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for classifications (linked to user's documents)
CREATE POLICY "Users can view classifications for their documents" ON public.classifications FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.documents WHERE id = document_id AND user_id = auth.uid()));

-- RLS Policies for duties (linked to user's documents)
CREATE POLICY "Users can view duties for their documents" ON public.duties FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.documents WHERE id = document_id AND user_id = auth.uid()));

-- RLS Policies for compliance checks (linked to user's documents)
CREATE POLICY "Users can view compliance checks for their documents" ON public.compliance_checks FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.documents WHERE id = document_id AND user_id = auth.uid()));

-- RLS Policies for audit trails (linked to user's documents)
CREATE POLICY "Users can view audit trails for their documents" ON public.audit_trails FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.documents WHERE id = document_id AND user_id = auth.uid()));

-- Public read access for reference data
CREATE POLICY "Anyone can read kb_articles" ON public.kb_articles FOR SELECT USING (true);
CREATE POLICY "Anyone can read rules" ON public.rules FOR SELECT USING (true);
CREATE POLICY "Anyone can read compliance_rules" ON public.compliance_rules FOR SELECT USING (true);

-- Admin policies for reference data management
CREATE POLICY "Admins can manage kb_articles" ON public.kb_articles FOR ALL 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'ADMIN'));

-- Create indexes for performance
CREATE INDEX idx_documents_user_id ON public.documents(user_id);
CREATE INDEX idx_documents_status ON public.documents(status);
CREATE INDEX idx_documents_upload_timestamp ON public.documents(upload_timestamp DESC);
CREATE INDEX idx_classifications_document_id ON public.classifications(document_id);
CREATE INDEX idx_duties_document_id ON public.duties(document_id);
CREATE INDEX idx_rules_hs_code_prefix ON public.rules(hs_code_prefix);
CREATE INDEX idx_kb_articles_keywords ON public.kb_articles USING GIN(keywords);
CREATE INDEX idx_compliance_rules_hs_codes ON public.compliance_rules USING GIN(hs_code_applicability);

-- Trigger to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_kb_articles_updated_at BEFORE UPDATE ON public.kb_articles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_rules_updated_at BEFORE UPDATE ON public.rules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();