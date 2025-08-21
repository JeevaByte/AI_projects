import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { StatusBadge, StatusType } from "@/components/StatusBadge";
import { 
  FileText, 
  Brain, 
  Calculator, 
  Shield, 
  Clock, 
  Download, 
  Edit3, 
  Check, 
  X,
  AlertTriangle,
  BarChart3,
  Target
} from "lucide-react";

interface DocumentDetail {
  id: string;
  name: string;
  status: StatusType;
  hsCode: string;
  confidence: number;
  uploadDate: string;
  processedDate: string;
  fileSize: string;
  fileType: string;
  extractedText: string;
  aiReasoning: string;
  dutyBreakdown: {
    assessableValue: number;
    bcd: number;
    igst: number;
    cess: number;
    total: number;
  };
  complianceChecks: Array<{
    rule: string;
    status: 'PASS' | 'FAIL' | 'WARNING';
    description: string;
  }>;
  alternativeCodes: Array<{
    code: string;
    confidence: number;
    description: string;
  }>;
  processingSteps: Array<{
    step: string;
    duration: number;
    status: 'completed' | 'processing' | 'pending';
  }>;
}

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentDetail | null;
  onApprove?: () => void;
  onReject?: () => void;
  onRequestReview?: () => void;
}

export const DetailModal = ({ 
  isOpen, 
  onClose, 
  document, 
  onApprove, 
  onReject, 
  onRequestReview 
}: DetailModalProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  if (!document) return null;

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-success";
    if (confidence >= 70) return "text-warning";
    return "text-destructive";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5" />
              {document.name}
            </div>
            <StatusBadge status={document.status}>
              {document.status.toUpperCase()}
            </StatusBadge>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
            <TabsTrigger value="duties">Duties</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[60vh] w-full">
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Document Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">File Size:</span>
                      <span>{document.fileSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span>{document.fileType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Uploaded:</span>
                      <span>{document.uploadDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Processed:</span>
                      <span>{document.processedDate}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Classification</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-lg">{document.hsCode}</span>
                      <Badge className={getConfidenceColor(document.confidence)}>
                        {document.confidence}%
                      </Badge>
                    </div>
                    <Progress value={document.confidence} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      AI Confidence Score
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Extracted Text Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-3 rounded-md text-sm font-mono max-h-32 overflow-y-auto">
                    {document.extractedText}
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2 pt-4">
                {document.status === 'pending' && (
                  <>
                    <Button variant="success" onClick={onApprove} className="flex-1">
                      <Check className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button variant="destructive" onClick={onReject} className="flex-1">
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </>
                )}
                {document.status === 'review' && (
                  <Button variant="warning" onClick={onRequestReview} className="flex-1">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Request Human Review
                  </Button>
                )}
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="ai-analysis" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    AI Reasoning & Explanation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-primary/5 p-4 rounded-lg border-l-4 border-primary">
                    <p className="text-sm leading-relaxed">{document.aiReasoning}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Alternative Classifications
                    </h4>
                    <div className="space-y-2">
                      {document.alternativeCodes.map((alt, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded">
                          <div>
                            <span className="font-mono">{alt.code}</span>
                            <p className="text-xs text-muted-foreground">{alt.description}</p>
                          </div>
                          <Badge variant="outline">{alt.confidence}%</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="duties" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Duty Calculation Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Assessable Value:</span>
                        <span className="font-mono">₹{document.dutyBreakdown.assessableValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>BCD (10%):</span>
                        <span className="font-mono">₹{document.dutyBreakdown.bcd.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>IGST (18%):</span>
                        <span className="font-mono">₹{document.dutyBreakdown.igst.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cess (1%):</span>
                        <span className="font-mono">₹{document.dutyBreakdown.cess.toLocaleString()}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total Duty:</span>
                        <span className="font-mono text-primary">₹{document.dutyBreakdown.total.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="bg-gradient-primary/10 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Calculation Method</h4>
                      <p className="text-sm text-muted-foreground">
                        BCD calculated on CIF value. IGST calculated on (CIF + BCD). 
                        Cess applied as per notification 1/2017.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="compliance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Compliance Checks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {document.complianceChecks.map((check, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          {check.status === 'PASS' && <Check className="w-4 h-4 text-success" />}
                          {check.status === 'FAIL' && <X className="w-4 h-4 text-destructive" />}
                          {check.status === 'WARNING' && <AlertTriangle className="w-4 h-4 text-warning" />}
                          <div>
                            <p className="font-medium">{check.rule}</p>
                            <p className="text-sm text-muted-foreground">{check.description}</p>
                          </div>
                        </div>
                        <Badge 
                          variant={check.status === 'PASS' ? 'default' : check.status === 'FAIL' ? 'destructive' : 'outline'}
                        >
                          {check.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="processing" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Processing Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {document.processingSteps.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${
                          step.status === 'completed' ? 'bg-success' : 
                          step.status === 'processing' ? 'bg-warning animate-pulse' : 'bg-muted'
                        }`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{step.step}</span>
                            <span className="text-sm text-muted-foreground">
                              {step.duration}ms
                            </span>
                          </div>
                          {step.status === 'processing' && (
                            <Progress value={75} className="h-1 mt-1" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};