import { Upload, FileText, Briefcase } from "lucide-react";
import { useState } from "react";

interface UploadZoneProps {
  type: "resume" | "jd";
  onFileUpload?: (file: File) => void;
}

export const UploadZone = ({ type, onFileUpload }: UploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      onFileUpload?.(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileUpload?.(file);
    }
  };

  const Icon = type === "resume" ? FileText : Briefcase;
  const label = type === "resume" ? "Resume" : "Job Description";

  return (
    <div
      className={`glass-card rounded-lg p-6 transition-all duration-300 ${
        isDragging ? "border-primary shadow-lg shadow-primary/20" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id={`upload-${type}`}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleFileSelect}
      />
      <label
        htmlFor={`upload-${type}`}
        className="flex flex-col items-center gap-3 cursor-pointer"
      >
        <div className={`p-3 rounded-full ${type === "resume" ? "gradient-bg" : "bg-accent"} transition-all duration-300 hover:scale-110`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-foreground mb-1">{label}</p>
          {fileName ? (
            <p className="text-xs text-success truncate max-w-[200px]">{fileName}</p>
          ) : (
            <p className="text-xs text-muted-foreground">Drop file or click</p>
          )}
        </div>
      </label>
    </div>
  );
};
