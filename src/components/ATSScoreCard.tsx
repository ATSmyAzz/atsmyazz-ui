import { useState, useEffect } from "react";

export const ATSScoreCard = ({ score = 0 }: { score?: number }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 300);
    return () => clearTimeout(timer);
  }, [score]);

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (animatedScore / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "hsl(var(--success))";
    if (score >= 60) return "hsl(var(--warning))";
    return "hsl(var(--destructive))";
  };

  return (
    <div className="glass-card rounded-lg p-6 animate-score-appear">
      <h3 className="text-sm font-semibold text-muted-foreground mb-4">ATS Score</h3>
      
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-32 h-32">
          <svg className="transform -rotate-90 w-32 h-32">
            {/* Background circle */}
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="hsl(var(--border))"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke={getScoreColor(animatedScore)}
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              style={{
                filter: `drop-shadow(0 0 8px ${getScoreColor(animatedScore)})`,
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">
                {animatedScore}
              </div>
              <div className="text-xs text-muted-foreground">/ 100</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full text-center">
          <div>
            <div className="text-lg font-bold text-success">12</div>
            <div className="text-xs text-muted-foreground">Matched</div>
          </div>
          <div>
            <div className="text-lg font-bold text-destructive">5</div>
            <div className="text-xs text-muted-foreground">Missing</div>
          </div>
          <div>
            <div className="text-lg font-bold text-warning">3</div>
            <div className="text-xs text-muted-foreground">Weak</div>
          </div>
        </div>
      </div>
    </div>
  );
};
