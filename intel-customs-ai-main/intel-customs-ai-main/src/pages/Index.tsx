import { DocumentUpload } from "@/components/DocumentUpload";
import { ClassificationResults } from "@/components/ClassificationResults";
import { DashboardStats } from "@/components/DashboardStats";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Shield, Zap, FileSearch, Settings, Bell } from "lucide-react";
import customsHero from "@/assets/customs-hero.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-hero shadow-elegant">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  AI Customs Classification System
                </h1>
                <p className="text-sm text-white/80">
                  Automated HS Code Classification & Duty Assessment
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                <Shield className="w-3 h-3 mr-1" />
                DPDP Compliant
              </Badge>
              <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                <Settings className="w-4 h-4 mr-1" />
                Settings
              </Button>
              <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                <Bell className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Hero Section */}
        <Card className="overflow-hidden shadow-elegant">
          <div className="relative">
            <img 
              src={customsHero} 
              alt="Customs clearance and classification system" 
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-accent/80 flex items-center">
              <div className="container mx-auto px-6">
                <div className="max-w-2xl text-white">
                  <h2 className="text-3xl font-bold mb-4">
                    Intelligent Customs Classification
                  </h2>
                  <p className="text-lg mb-6 text-white/90">
                    AI-powered system for automated product classification, duty computation, 
                    and compliance checks with human-in-the-loop review.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      <span>Real-time Processing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileSearch className="w-5 h-5" />
                      <span>8-digit HS Codes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      <span>Compliance Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Dashboard Stats */}
        <DashboardStats />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Document Upload */}
          <div className="lg:col-span-1">
            <DocumentUpload />
          </div>

          {/* Classification Results */}
          <div className="lg:col-span-2">
            <ClassificationResults />
          </div>
        </div>

        {/* Features Overview */}
        <Card className="shadow-elegant">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold mb-6">System Capabilities</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto">
                  <Bot className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-semibold">AI Classification</h4>
                <p className="text-sm text-muted-foreground">
                  Advanced ML models for accurate HS code determination with semantic understanding
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="p-3 bg-success/10 rounded-full w-fit mx-auto">
                  <Shield className="w-8 h-8 text-success" />
                </div>
                <h4 className="font-semibold">Compliance Engine</h4>
                <p className="text-sm text-muted-foreground">
                  Rule-based system for FTA, BIS, FSSAI compliance with real-time updates
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="p-3 bg-accent/10 rounded-full w-fit mx-auto">
                  <FileSearch className="w-8 h-8 text-accent" />
                </div>
                <h4 className="font-semibold">Document Intelligence</h4>
                <p className="text-sm text-muted-foreground">
                  Extract structured data from invoices, PDFs with high accuracy parsing
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;