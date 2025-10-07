import { ZoomIn, ZoomOut, Download, Copy, GitCompare, Upload, Edit2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { TemplateEngine } from "./TemplateEngine";
import { parseResume } from "@/parsers/universalParser";
import { mapToAshTemplate } from "@/mappers/contentMapper";
import { useToast } from "@/hooks/use-toast";
import html2pdf from "html2pdf.js";

// Sample resume data as default template - CORRECTED to match ash.docx exactly
const defaultResumeContent = {
  name: "ASHWIN KUMAR UMA SANKAR",
  contact: "ufoundashwin@gmail.com | +1 (458) 272-4170 | 85282, Tempe, AZ | Github | ashxinkumar.me",
  summary: [
    "AI/ML and Full stack Engineer with 3+ years of experience in high-performance web and AI-integrated applications, specializing in",
    "Angular, React, Next.js, LLMs, RAG pipelines, AI-assisted automation, and cloud deployment (AWS/GCP), with a proven track",
    "record in optimizing performance, scaling systems, and contributing to AI research and open-source projects."
  ],
  education: [
    {
      degree: "MEng in Computer Science",
      school: "Oregon State University",
      details: "Operating System II, Algorithms",
      gpa: "GPA: 3.7/4.0",
      period: "09/2023 – 06/2025"
    },
    {
      degree: "BTech in Computer Science",
      school: "Hindustan University",
      details: "Cyber Security & Forensics Graduate",
      gpa: "GPA: 3.6/4.0",
      period: "06/2018 – 05/2022"
    }
  ],
  skills: [
    { category: "Languages", items: "Python, Java, JavaScript, TypeScript, C++" },
    { category: "AI & ML", items: "TensorFlow, PyTorch, Keras, Hugging Face, LLaMA 3, Groq, RAG, NLP, OpenCV, Scikit-learn, SpaCy, Agents, MCP" },
    { category: "Tools", items: "Tableau, Streamlit, WebSocket, Lighthouse CI, Sentry, Nginx, Plotly, Edge Caching" },
    { category: "Database", items: "MySQL, MongoDB, PostgreSQL, VectorDB, Pinecone, Supabase, ElasticSearch, FAISS, ChromaDB, Firebase" },
    { category: "Cloud", items: "AWS (Lambda, S3, CloudFront), GCP (Cloud Run, Kubernetes, Pub/Sub), Docker, CI/CD Pipelines, GitLab, GitHub Actions" },
    { category: "Web Development", items: "Angular, React 18, Next.js, TypeScript, RxJS, NgRx, Vite, Tailwind CSS, Cypress" },
    { category: "Certifications", items: "AWS Certified Solutions Architect, Python Data Structures, CI/CD & DevOps – University of Virginia" }
  ],
  experience: [
    {
      company: "CLAW CODE",
      location: "Arizona – Remote",
      title: "Co-Founder",
      period: "07/2025 – Present",
      bullets: [
        "Fine-tuned a <strong>20B</strong> open-source LLM using Python, LangChain, and custom RAG pipelines to auto-generate 2D/3D games with Phaser.js, Three.js, and Babylon.js, cutting generation time to <strong>&lt;1 min</strong> (<strong>3–4 min</strong> faster than baseline like Loveable/Base44).",
        "Designed custom datasets, reusable prompt templates, and agent-based benchmarking tools to evaluate <strong>30+</strong> game scenarios, improving playability, latency, and deployment speed enabling live previews and one-click production launches."
      ]
    },
    {
      company: "OREGON STATE UNIVERSITY",
      location: "Corvallis – Remote",
      title: "Project Assistant and Web Developer",
      period: "01/2024 – 06/2025",
      bullets: [
        "Numba JIT-compiled Python algorithms in the <strong>SCARR Open-Source Framework</strong>, boosting <strong>300GB+</strong> LRA data processing by <strong>30%</strong> and improving signal accuracy via SNR and Chi-Square validation (benchmarked with VTune) under Professor Vincent Immler.",
        "Contributed to a <strong>7-person</strong> cross-functional team (developers + designers) in redesigning Oregon State University's 2025 web platform. Explored AI-assisted development by integrating GitHub Copilot and fine-tuning LLaMA to automate boilerplate code, speeding up feature delivery by <strong>30%</strong>."
      ]
    },
    {
      company: "KIVI",
      location: "IITM Research Park, Chennai",
      title: "Associate Software Developer",
      period: "06/2022 – 08/2023",
      bullets: [
        "Built <strong>20+</strong> Angular & React Native applications serving <strong>20K+</strong> monthly active users, including land analysis tools and digital banking platforms with <strong>&lt;800ms</strong> latency for smooth user experience.",
        "Integrated secure fintech workflows using Equifax, DocuSign/Razorpay, and OAuth 2.0/JWT, reliably processing <strong>2K+</strong> daily transactions. Automated CI/CD pipelines with <strong>GitLab & GitRunners</strong>, reducing deployment times by <strong>30%</strong> and minimizing production errors."
      ]
    },
    {
      company: "GENWORKS",
      location: "Wipro, Bangalore",
      title: "Data Analyst Consultant",
      period: "01/2022 – 05/2022",
      bullets: [
        "Streamlined <strong>50+</strong> MongoDB and Cassandra collections by restructuring schemas and collaborated with engineering to migrate legacy datasets to AWS DynamoDB, reducing query latency by <strong>40%</strong> for faster dashboard loads.",
        "Developed Python scripts to sync product, customer, and transaction data with built-in automated validation checks, enabling real-time dashboards with <strong>&lt;2s</strong> refresh rates."
      ]
    }
  ],
  projects: [
    {
      name: "AI-Native Development Tools",
      tech: "Python, LLaMA 3, scikit-learn, FastAPI",
      bullets: [
        "Built AI-powered developer tools including SnappyPilot, a LLaMA-3 Git issue generator for VSCode/CLI; SnipperScrapper, a Chrome extension using RAG for <strong>87%</strong> accurate code solutions from <strong>Stack Overflow and Medium</strong>; and TaskPilot AI, an AI task manager with <strong>auto-priority scheduling</strong>, improving planning speed by <strong>65%</strong>. <a href='https://www.ashxinkumar.me/projects' target='_blank' rel='noopener noreferrer'>Live Demo</a>"
      ]
    },
    {
      name: "Performance at Scale -- Emergency Route System",
      tech: "Python, AWS Lambda, Edge Caching",
      bullets: [
        "Developed a low-latency <strong>crisis routing system</strong> with Professor Zhang, Yue for DA Office in Salem, Oregon, achieving <strong>&lt;400ms</strong> response time using Python, AWS Lambda, and edge caching for scalable, real-time performance in high-pressure emergency scenarios. <a href='https://www.ashxinkumar.me/projects' target='_blank' rel='noopener noreferrer'>Live Demo</a>"
      ]
    },
    {
      name: "Open-Source Contributions",
      tech: "Python, Angular, AI, DevOps",
      bullets: [
        "Maintained <strong>50+</strong> repositories across Angular, AI, and DevOps projects, contributing over <strong>500</strong> commits and improving code quality and scalability. <a href='https://www.ashxinkumar.me/projects' target='_blank' rel='noopener noreferrer'>Live Demo</a>"
      ]
    }
  ]
};

export const ResumeViewer = () => {
  const [zoom, setZoom] = useState(100);
  const [resumeData, setResumeData] = useState(defaultResumeContent);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(defaultResumeContent);
  const resumeRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // Parse the uploaded resume
      const parsedData = await parseResume(file);

      // Map to Ash template structure
      const mappedData = mapToAshTemplate(parsedData);

      // Update resume data
      setResumeData(mappedData);
      setEditedData(mappedData);

      toast({
        title: "Resume Uploaded Successfully",
        description: `${file.name} has been reformatted to match the template.`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to parse resume. Please try a different format.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!resumeRef.current) return;

    try {
      const opt = {
        margin: 0,
        filename: `${resumeData.name.replace(/\s+/g, '_')}_Resume.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true
        },
        jsPDF: {
          unit: 'in',
          format: 'letter',
          orientation: 'portrait'
        }
      };

      await html2pdf().set(opt).from(resumeRef.current).save();

      toast({
        title: "PDF Downloaded",
        description: "Your resume has been downloaded successfully.",
      });
    } catch (error) {
      console.error('PDF download error:', error);
      toast({
        title: "Download Failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = () => {
    setEditedData({ ...resumeData });
    setIsEditing(true);
  };

  const handleSave = () => {
    setResumeData({ ...editedData });
    setIsEditing(false);
    toast({
      title: "Changes Saved",
      description: "Your resume has been updated.",
    });
  };

  const handleCancel = () => {
    setEditedData({ ...resumeData });
    setIsEditing(false);
  };

  const highlightKeyword = (text: string) => {
    const keywords = {
      matched: ["JavaScript", "React", "Node.js", "Git", "Agile", "Python", "TypeScript", "AWS", "Docker", "Angular", "LLaMA", "RAG", "LangChain", "CI/CD", "MongoDB", "PostgreSQL"],
      missing: ["Kubernetes", "GraphQL"],
      weak: ["Jenkins"],
    };

    let result = text;

    keywords.matched.forEach((word) => {
      result = result.replace(
        new RegExp(`\\b${word}\\b`, "g"),
        `<span class="keyword-matched">${word}</span>`
      );
    });

    keywords.missing.forEach((word) => {
      result = result.replace(
        new RegExp(`\\b${word}\\b`, "g"),
        `<span class="keyword-missing">${word}</span>`
      );
    });

    keywords.weak.forEach((word) => {
      result = result.replace(
        new RegExp(`\\b${word}\\b`, "g"),
        `<span class="keyword-weak">${word}</span>`
      );
    });

    return result;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="glass-card rounded-t-lg p-3 flex items-center justify-between gap-2 border-b border-border/50">
        <div className="flex gap-2">
          <label htmlFor="resume-upload">
            <Button size="sm" variant="outline" className="h-8" asChild disabled={isUploading}>
              <span className="cursor-pointer">
                <Upload className="w-3 h-3 mr-1" />
                {isUploading ? 'Uploading...' : 'Upload'}
              </span>
            </Button>
          </label>
          <input
            id="resume-upload"
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button size="sm" variant="outline" className="h-8" onClick={handleDownloadPDF}>
            <Download className="w-3 h-3 mr-1" />
            PDF
          </Button>
          {!isEditing ? (
            <Button size="sm" variant="outline" className="h-8" onClick={handleEdit}>
              <Edit2 className="w-3 h-3 mr-1" />
              Edit
            </Button>
          ) : (
            <>
              <Button size="sm" variant="outline" className="h-8" onClick={handleSave}>
                <Save className="w-3 h-3 mr-1" />
                Save
              </Button>
              <Button size="sm" variant="outline" className="h-8" onClick={handleCancel}>
                <X className="w-3 h-3 mr-1" />
                Cancel
              </Button>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => setZoom(Math.max(75, zoom - 25))}
          >
            <ZoomOut className="w-3 h-3" />
          </Button>
          <span className="text-xs text-muted-foreground w-12 text-center">
            {zoom}%
          </span>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => setZoom(Math.min(150, zoom + 25))}
          >
            <ZoomIn className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Resume Paper */}
      <div className="flex-1 overflow-y-auto bg-card/30 flex items-start justify-center p-6">
        <div
          ref={resumeRef}
          style={{
            width: zoom === 100 ? '100%' : 'fit-content',
            maxWidth: zoom === 100 ? '100%' : 'none',
            display: 'flex',
            justifyContent: 'center'
          }}>
          <TemplateEngine
            data={isEditing ? editedData : resumeData}
            zoom={zoom}
            highlightKeywords={highlightKeyword}
            isEditing={isEditing}
            onDataChange={setEditedData}
          />
        </div>
      </div>
    </div>
  );
};