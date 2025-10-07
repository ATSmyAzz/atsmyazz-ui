import { useState } from "react";
import { UploadZone } from "@/components/UploadZone";
import { ATSScoreCard } from "@/components/ATSScoreCard";
import { KeywordPills } from "@/components/KeywordPills";
import { ResumeViewer } from "@/components/ResumeViewer";
import { IssuesPanel } from "@/components/IssuesPanel";
import { ChatInterface } from "@/components/ChatInterface";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [score, setScore] = useState(0);
  const [hasUploaded, setHasUploaded] = useState(false);

  const handleFileUpload = (file: File) => {
    // Mock score calculation after upload
    setTimeout(() => {
      setScore(73);
      setHasUploaded(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 glass-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="gradient-bg p-2 rounded-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold gradient-text">ATSmyAzz</h1>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="h-9 border-border/50 hover:border-primary hover:bg-primary/10 transition-all"
          >
            <User className="w-4 h-4 mr-2" />
            Account
          </Button>
        </div>
      </header>

      {/* Desktop Layout (3 columns) */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-4 container mx-auto px-4 py-6 h-[calc(100vh-80px)]">
        {/* Left Panel - 20% */}
        <div className="col-span-2 space-y-4 overflow-y-auto">
          <div className="space-y-4">
            <UploadZone type="resume" onFileUpload={handleFileUpload} />
            <UploadZone type="jd" onFileUpload={handleFileUpload} />
          </div>
          <ATSScoreCard score={hasUploaded ? score : 0} />
          <KeywordPills />
        </div>

        {/* Center Panel - 55% */}
        <div className="col-span-7 flex flex-col gap-4">
          <ResumeViewer />
          <IssuesPanel />
        </div>

        {/* Right Panel - 25% */}
        <div className="col-span-3">
          <ChatInterface />
        </div>
      </div>

      {/* Mobile Layout (Tabbed) */}
      <div className="lg:hidden px-4 py-6">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-3 glass-card">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="resume">Resume</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4 mt-4">
            <div className="space-y-4">
              <UploadZone type="resume" onFileUpload={handleFileUpload} />
              <UploadZone type="jd" onFileUpload={handleFileUpload} />
            </div>
            <ATSScoreCard score={hasUploaded ? score : 0} />
            <KeywordPills />
          </TabsContent>
          
          <TabsContent value="resume" className="mt-4">
            <div className="h-[calc(100vh-180px)]">
              <ResumeViewer />
            </div>
            <div className="mt-4">
              <IssuesPanel />
            </div>
          </TabsContent>
          
          <TabsContent value="chat" className="mt-4">
            <div className="h-[calc(100vh-180px)]">
              <ChatInterface />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
