import { useState, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, X, Image, File, CheckCircle, AlertCircle, Zap } from "lucide-react";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
}

export const DocumentUpload = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback((selectedFiles: File[]) => {
    selectedFiles.forEach((file) => {
      // Validate file type and size
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: `${file.name} is not a supported file type.`,
          variant: "destructive",
        });
        return;
      }

      if (file.size > maxSize) {
        toast({
          title: "File Too Large",
          description: `${file.name} exceeds the 10MB limit.`,
          variant: "destructive",
        });
        return;
      }

      const newFile: UploadedFile = {
        id: Math.random().toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0
      };
      
      setFiles(prev => [...prev, newFile]);
      
      // Simulate realistic upload progress with multiple stages
      setIsUploading(true);
      let currentProgress = 0;
      
      const interval = setInterval(() => {
        currentProgress += Math.random() * 15 + 5; // Random progress between 5-20%
        
        setFiles(prev => 
          prev.map(f => 
            f.id === newFile.id 
              ? { ...f, progress: Math.min(currentProgress, 100) }
              : f
          )
        );

        if (currentProgress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          toast({
            title: "Upload Complete",
            description: `${file.name} uploaded and ready for processing`,
          });
        }
      }, 150);
    });
  }, [toast]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    processFiles(selectedFiles);
  }, [processFiles]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  }, [processFiles]);

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`;
  };

  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Document Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
            dragActive 
              ? 'border-primary bg-primary/5 scale-[1.02]' 
              : 'border-border hover:border-primary/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer block">
            <div className={`transition-all duration-200 ${dragActive ? 'scale-110' : ''}`}>
              <Upload className={`w-12 h-12 mx-auto mb-4 transition-colors ${
                dragActive ? 'text-primary' : 'text-muted-foreground'
              }`} />
              <p className="text-lg font-medium mb-2">
                {dragActive ? 'Drop files here' : 'Upload Documents'}
              </p>
              <p className="text-sm text-muted-foreground">
                {dragActive 
                  ? 'Release to upload your documents' 
                  : 'Drag and drop files here, or click to browse'
                }
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Supports PDF, Images, Word documents (Max 10MB each)
              </p>
            </div>
          </label>
        </div>

        {files.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Uploaded Files</h4>
            {files.map((file) => {
              const isImage = file.type.startsWith('image/');
              const isPdf = file.type === 'application/pdf';
              const isDoc = file.type.includes('word');
              const isCompleted = file.progress === 100;
              
              return (
                <div key={file.id} className="flex items-center justify-between p-4 bg-card border rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative">
                      {isImage && <Image className="w-6 h-6 text-accent" />}
                      {isPdf && <FileText className="w-6 h-6 text-destructive" />}
                      {isDoc && <File className="w-6 h-6 text-primary" />}
                      {!isImage && !isPdf && !isDoc && <FileText className="w-6 h-6 text-muted-foreground" />}
                      {isCompleted && (
                        <CheckCircle className="absolute -top-1 -right-1 w-3 h-3 text-success bg-background rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        {isCompleted && <Badge variant="outline" className="text-xs">Ready</Badge>}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatFileSize(file.size)}</span>
                        <span>•</span>
                        <span className="capitalize">{file.type.split('/')[1] || 'Unknown'}</span>
                        {file.progress < 100 && (
                          <>
                            <span>•</span>
                            <span>{Math.round(file.progress)}% uploaded</span>
                          </>
                        )}
                      </div>
                      {file.progress < 100 && (
                        <Progress value={file.progress} className="mt-2 h-1.5" />
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {files.length > 0 && (
          <div className="flex gap-2">
            <Button variant="gradient" className="flex-1" disabled={isUploading}>
              <Zap className="w-4 h-4 mr-2" />
              {isUploading ? "Processing..." : "Start AI Classification"}
            </Button>
            <Button variant="outline" onClick={() => setFiles([])}>
              Clear All
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};