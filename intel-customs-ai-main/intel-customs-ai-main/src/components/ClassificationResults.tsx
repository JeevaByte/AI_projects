import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, StatusType } from "@/components/StatusBadge";
import { DetailModal } from "@/components/DetailModal";
import { SearchAndFilter } from "@/components/SearchAndFilter";
import { 
  FileText, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Eye,
  Filter,
  Download,
  MoreHorizontal,
  Info
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ClassificationResult {
  id: string;
  documentName: string;
  hsCode: string;
  description: string;
  confidence: number;
  status: StatusType;
  processedDate: string;
  dutyAmount: number;
  exemptionApplied: boolean;
  complianceStatus: "pass" | "warning" | "fail";
  rulesApplied: string[];
  basicDuty: number;
  igst: number;
  totalDuty: number;
  exemptions: string[];
  rulesCited: string[];
}

const mockResults: ClassificationResult[] = [
  {
    id: "1",
    documentName: "invoice-electronics-001.pdf",
    hsCode: "85176290",
    description: "Wireless earphones with charging case",
    confidence: 94,
    status: "approved",
    processedDate: "2024-03-15T09:32:15Z",
    dutyAmount: 23840,
    exemptionApplied: false,
    complianceStatus: "pass",
    rulesApplied: ["HS Rule 1", "Chapter Note 7"],
    basicDuty: 20,
    igst: 18,
    totalDuty: 23840,
    exemptions: [],
    rulesCited: ["HS Rule 1", "Chapter Note 7"]
  },
  {
    id: "2", 
    documentName: "textile-goods-invoice.pdf",
    hsCode: "62034290",
    description: "Men's cotton trousers",
    confidence: 87,
    status: "review",
    processedDate: "2024-03-14T14:22:10Z",
    dutyAmount: 12200,
    exemptionApplied: true,
    complianceStatus: "warning",
    rulesApplied: ["HS Rule 3(b)", "Section Note 2"],
    basicDuty: 10,
    igst: 12,
    totalDuty: 12200,
    exemptions: ["Notification 50/2017"],
    rulesCited: ["HS Rule 3(b)", "Section Note 2"]
  },
  {
    id: "3",
    documentName: "machinery-import.pdf", 
    hsCode: "84501200",
    description: "Automatic washing machines, capacity 8 kg",
    confidence: 91,
    status: "pending",
    processedDate: "2024-03-15T11:45:33Z",
    dutyAmount: 25575,
    exemptionApplied: false,
    complianceStatus: "pass",
    rulesApplied: ["HS Rule 1", "Additional Note 1"],
    basicDuty: 7.5,
    igst: 18,
    totalDuty: 25575,
    exemptions: [],
    rulesCited: ["HS Rule 1", "Additional Note 1"]
  }
];

export const ClassificationResults = () => {
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    dateRange: 'all'
  });
  const [sortBy, setSortBy] = useState<'date' | 'confidence' | 'status'>('date');

  const mockDetailDocument = {
    id: "doc_001",
    name: "Commercial_Invoice_ABC123.pdf",
    status: "pending" as StatusType,
    hsCode: "8708.30.10",
    confidence: 94.2,
    uploadDate: "2024-03-15 09:30:00",
    processedDate: "2024-03-15 09:32:15",
    fileSize: "2.4 MB",
    fileType: "PDF",
    extractedText: "COMMERCIAL INVOICE\\nDate: March 15, 2024\\nInvoice No: INV-2024-001\\n\\nDescription of Goods:\\nAutomotive brake pads for passenger vehicles\\nQuantity: 500 sets\\nUnit Price: $45.00\\nTotal Value: $22,500.00\\n\\nCountry of Origin: Germany\\nHS Code: 8708.30.10\\nBrand: Premium Auto Parts\\nModel: PAP-BP-2024",
    aiReasoning: "Based on the document analysis, this item is classified as automotive brake pads (HS Code 8708.30.10). The classification confidence is high due to clear product description matching 'brake pads for passenger vehicles' which directly corresponds to Chapter 87 (Vehicles other than railway) subheading 8708 (Parts and accessories of vehicles) specifically 8708.30 (Brakes and servo-brakes; parts thereof) and further subdivision 8708.30.10 for brake pads. The supporting evidence includes the commercial invoice clearly stating the product description, country of origin (Germany), and intended use for passenger vehicles.",
    dutyBreakdown: {
      assessableValue: 1872000, // ₹22,500 * 83.2 (USD to INR)
      bcd: 187200, // 10% BCD
      igst: 371520, // 18% IGST on (CIF + BCD)
      cess: 18720, // 1% Cess
      total: 577440
    },
    complianceChecks: [
      {
        rule: "BIS Certification Required",
        status: "PASS" as const,
        description: "Automotive parts from Germany are pre-approved under mutual recognition agreement"
      },
      {
        rule: "FSSAI Clearance",
        status: "PASS" as const,
        description: "Not applicable for automotive parts"
      },
      {
        rule: "Anti-Dumping Duty",
        status: "WARNING" as const,
        description: "Monitor for potential anti-dumping duty on brake pads from EU"
      },
      {
        rule: "FTA Benefits",
        status: "PASS" as const,
        description: "Eligible for India-EU FTA benefits with proper documentation"
      }
    ],
    alternativeCodes: [
      {
        code: "8708.39.90",
        confidence: 87.5,
        description: "Other parts of braking systems"
      },
      {
        code: "8708.30.90",
        confidence: 82.1,
        description: "Other brake parts and accessories"
      },
      {
        code: "8708.99.90",
        confidence: 65.3,
        description: "Other parts and accessories of vehicles"
      }
    ],
    processingSteps: [
      {
        step: "Document Upload",
        duration: 250,
        status: "completed" as const
      },
      {
        step: "OCR Text Extraction",
        duration: 1200,
        status: "completed" as const
      },
      {
        step: "AI Classification",
        duration: 2800,
        status: "completed" as const
      },
      {
        step: "Duty Calculation",
        duration: 450,
        status: "completed" as const
      },
      {
        step: "Compliance Check",
        duration: 680,
        status: "processing" as const
      }
    ]
  };

  const handleViewDetails = (result: ClassificationResult) => {
    setSelectedDocument(mockDetailDocument);
    setIsModalOpen(true);
  };

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, search: query }));
  };

  const handleStatusFilter = (status: string) => {
    setFilters(prev => ({ ...prev, status }));
  };

  const handleDateFilter = (dateRange: string) => {
    setFilters(prev => ({ ...prev, dateRange }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      dateRange: 'all'
    });
  };

  // Filter and sort results
  let filteredResults = mockResults.filter(result => {
    const matchesSearch = filters.search === '' || 
      result.documentName.toLowerCase().includes(filters.search.toLowerCase()) ||
      result.hsCode.includes(filters.search) ||
      result.description.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStatus = filters.status === 'all' || result.status === filters.status;
    
    return matchesSearch && matchesStatus;
  });

  // Sort results
  filteredResults.sort((a, b) => {
    switch (sortBy) {
      case 'confidence':
        return b.confidence - a.confidence;
      case 'status':
        return a.status.localeCompare(b.status);
      case 'date':
      default:
        return new Date(b.processedDate).getTime() - new Date(a.processedDate).getTime();
    }
  });
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Classification Results</h2>
          <p className="text-muted-foreground">
            AI-powered document classification and duty calculation results
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-3 py-1">
            {filteredResults.length} of {mockResults.length} Documents
          </Badge>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Results
          </Button>
        </div>
      </div>

      <SearchAndFilter
        onSearch={handleSearch}
        onStatusFilter={handleStatusFilter}
        onDateFilter={handleDateFilter}
        activeFilters={filters}
        onClearFilters={handleClearFilters}
      />

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {filteredResults.length} results
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-sm border rounded px-2 py-1 bg-background"
          >
            <option value="date">Processing Date</option>
            <option value="confidence">Confidence Score</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredResults.map((result) => (
          <Card key={result.id} className="shadow-elegant hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <FileText className="w-6 h-6 text-primary" />
                    <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                      result.complianceStatus === 'pass' ? 'bg-success' :
                      result.complianceStatus === 'warning' ? 'bg-warning' : 'bg-destructive'
                    }`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg hover:text-primary cursor-pointer transition-colors">
                      {result.documentName}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-4">
                      <span>
                        HS Code: <span className="font-mono font-medium text-primary">{result.hsCode}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(result.processedDate).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={`${
                      result.confidence >= 90 ? 'border-success text-success' :
                      result.confidence >= 70 ? 'border-warning text-warning' : 'border-destructive text-destructive'
                    }`}
                  >
                    {result.confidence}% confidence
                  </Badge>
                  <StatusBadge status={result.status}>
                    {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                  </StatusBadge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Product Description
                </h4>
                <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                  {result.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 p-3 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border">
                  <h4 className="font-medium flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Duty Breakdown
                  </h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Basic Duty:</span>
                      <span className="font-mono">{result.basicDuty}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>IGST:</span>
                      <span className="font-mono">{result.igst}%</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-1 text-primary">
                      <span>Total Duty:</span>
                      <span className="font-mono">₹{result.totalDuty.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 p-3 bg-gradient-to-br from-accent/5 to-accent/10 rounded-lg border">
                  <h4 className="font-medium flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    Exemptions Applied
                  </h4>
                  {result.exemptions.length > 0 ? (
                    <div className="space-y-1">
                      {result.exemptions.map((exemption, index) => (
                        <Badge key={index} variant="outline" className="text-xs block w-full text-center">
                          {exemption}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No exemptions applied</p>
                  )}
                </div>

                <div className="space-y-2 p-3 bg-gradient-to-br from-success/5 to-success/10 rounded-lg border">
                  <h4 className="font-medium flex items-center gap-2">
                    <Info className="w-4 h-4 text-success" />
                    Rules Cited
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {result.rulesCited.map((rule, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {rule}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Info className="w-4 h-4" />
                    Confidence Score
                    <Progress value={result.confidence} className="w-24 h-2" />
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <span 
                      className={`w-2 h-2 rounded-full ${
                        result.complianceStatus === 'pass' ? 'bg-success' :
                        result.complianceStatus === 'warning' ? 'bg-warning' : 'bg-destructive'
                      }`}
                    />
                    <span className="capitalize text-muted-foreground">
                      Compliance: {result.complianceStatus}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {result.status === "review" && (
                    <Button variant="warning" size="sm">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Review Required
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewDetails(result)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                  {result.status === "pending" && (
                    <Button variant="success" size="sm">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <DetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        document={selectedDocument}
        onApprove={() => {
          // Handle approve
          setIsModalOpen(false);
        }}
        onReject={() => {
          // Handle reject
          setIsModalOpen(false);
        }}
        onRequestReview={() => {
          // Handle request review
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};