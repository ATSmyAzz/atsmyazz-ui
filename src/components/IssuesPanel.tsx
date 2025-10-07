import { AlertCircle, AlertTriangle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface Issue {
  type: "error" | "warning" | "info";
  title: string;
  description: string;
}

const mockIssues: Issue[] = [
  {
    type: "error",
    title: "Missing contact information",
    description: "LinkedIn profile URL not found",
  },
  {
    type: "error",
    title: "Weak action verbs",
    description: "Replace 'Responsible for' with stronger verbs like 'Led' or 'Managed'",
  },
  {
    type: "warning",
    title: "Skills section missing keywords",
    description: "Add: Kubernetes, Microservices, REST APIs",
  },
  {
    type: "warning",
    title: "Bullet points too long",
    description: "Experience bullets should be 1-2 lines max",
  },
  {
    type: "info",
    title: "Formatting inconsistency",
    description: "Date formats vary across sections",
  },
];

export const IssuesPanel = () => {
  const [openSections, setOpenSections] = useState<string[]>(["errors"]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const errorIssues = mockIssues.filter((i) => i.type === "error");
  const warningIssues = mockIssues.filter((i) => i.type === "warning");
  const infoIssues = mockIssues.filter((i) => i.type === "info");

  const IssueGroup = ({
    title,
    icon: Icon,
    issues,
    color,
    section,
  }: {
    title: string;
    icon: any;
    issues: Issue[];
    color: string;
    section: string;
  }) => (
    <Collapsible
      open={openSections.includes(section)}
      onOpenChange={() => toggleSection(section)}
    >
      <CollapsibleTrigger className="w-full">
        <div
          className={`flex items-center justify-between p-3 rounded-lg glass-card border-l-4 ${color} hover:bg-card/50 transition-colors`}
        >
          <div className="flex items-center gap-3">
            <Icon className="w-5 h-5" />
            <div className="text-left">
              <h4 className="font-semibold text-sm">{title}</h4>
              <p className="text-xs text-muted-foreground">{issues.length} issues</p>
            </div>
          </div>
          <span className="text-xs text-muted-foreground">
            {openSections.includes(section) ? "▼" : "▶"}
          </span>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 space-y-2">
        {issues.map((issue, idx) => (
          <div key={idx} className="glass-card p-3 rounded-lg ml-4">
            <p className="text-sm font-medium text-foreground mb-1">{issue.title}</p>
            <p className="text-xs text-muted-foreground mb-3">{issue.description}</p>
            <Button size="sm" variant="outline" className="h-7 text-xs gradient-bg text-white border-0">
              ✨ Fix with AI
            </Button>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <div className="glass-card rounded-b-lg p-4 border-t border-border/50">
      <h3 className="text-sm font-semibold text-muted-foreground mb-4">ATS Issues</h3>
      <div className="space-y-3">
        <IssueGroup
          title="Critical Issues"
          icon={XCircle}
          issues={errorIssues}
          color="border-destructive"
          section="errors"
        />
        <IssueGroup
          title="Improvements Needed"
          icon={AlertTriangle}
          issues={warningIssues}
          color="border-warning"
          section="warnings"
        />
        <IssueGroup
          title="Suggestions"
          icon={AlertCircle}
          issues={infoIssues}
          color="border-accent"
          section="info"
        />
      </div>
    </div>
  );
};
