import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: "user" | "assistant";
  content: string;
  canApply?: boolean;
}

const mockMessages: Message[] = [
  {
    role: "assistant",
    content: "Hi! I'm your ATS assistant. Upload your resume and job description to get started, or ask me anything about optimizing your resume.",
  },
  {
    role: "user",
    content: "Can you help me improve my experience section?",
  },
  {
    role: "assistant",
    content: "I'd strengthen your experience bullets by:\n\n1. Starting with action verbs (Led, Implemented, Optimized)\n2. Adding quantifiable metrics (60% improvement, 5-person team)\n3. Highlighting relevant tech stack\n\nWould you like me to rewrite the first bullet point?",
    canApply: true,
  },
];

const quickActions = [
  "Optimize Summary",
  "Add Missing Keywords",
  "Improve Bullets",
  "Match Job Description",
];

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages([...messages, { role: "user", content: input }]);
    setInput("");
    
    // Mock AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm analyzing your request. Here's what I suggest...",
          canApply: true,
        },
      ]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Quick Actions */}
      <div className="glass-card rounded-t-lg p-4 border-b border-border/50">
        <h3 className="text-xs font-semibold text-muted-foreground mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action, idx) => (
            <Button
              key={idx}
              size="sm"
              variant="outline"
              className="h-auto py-2 text-xs hover:border-primary hover:bg-primary/10 transition-all"
            >
              {action}
            </Button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4 glass-card">
        <div className="space-y-4">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "gradient-bg text-white"
                    : "glass-card text-foreground border border-border/50"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {message.canApply && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3 h-7 text-xs gradient-bg text-white border-0 w-full"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Apply to Resume
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="glass-card rounded-b-lg p-4 border-t border-border/50">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask me anything..."
            className="flex-1 bg-card/50 border-border/50 focus-visible:ring-primary"
          />
          <Button
            size="sm"
            onClick={handleSend}
            className="gradient-bg hover:opacity-90 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
