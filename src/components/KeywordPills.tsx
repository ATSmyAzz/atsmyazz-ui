import { Badge } from "@/components/ui/badge";

interface Keyword {
  text: string;
  status: "matched" | "missing" | "weak";
}

const mockKeywords: Keyword[] = [
  { text: "JavaScript", status: "matched" },
  { text: "React", status: "matched" },
  { text: "TypeScript", status: "matched" },
  { text: "Node.js", status: "weak" },
  { text: "Python", status: "missing" },
  { text: "AWS", status: "missing" },
  { text: "Docker", status: "weak" },
  { text: "Git", status: "matched" },
  { text: "CI/CD", status: "missing" },
  { text: "Agile", status: "matched" },
];

export const KeywordPills = () => {
  const getVariant = (status: Keyword["status"]) => {
    switch (status) {
      case "matched":
        return "default";
      case "missing":
        return "destructive";
      case "weak":
        return "secondary";
    }
  };

  const getIcon = (status: Keyword["status"]) => {
    switch (status) {
      case "matched":
        return "✓";
      case "missing":
        return "✕";
      case "weak":
        return "⚠";
    }
  };

  return (
    <div className="glass-card rounded-lg p-6">
      <h3 className="text-sm font-semibold text-muted-foreground mb-4">Keywords</h3>
      <div className="flex flex-wrap gap-2 max-h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20">
        {mockKeywords.map((keyword, idx) => (
          <Badge
            key={idx}
            variant={getVariant(keyword.status)}
            className="cursor-pointer hover:scale-105 transition-transform animate-highlight"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <span className="mr-1">{getIcon(keyword.status)}</span>
            {keyword.text}
          </Badge>
        ))}
      </div>
    </div>
  );
};
