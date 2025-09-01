import { useState } from "react";
import { 
  Send, 
  GitBranch, 
  FileText, 
  Search, 
  Calculator,
  Lightbulb,
  MessageSquare,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const promptSuggestions = [
  "I need a comment for my design",
  "I want a caption for My LinkedIn Post", 
  "I need a copywriting for my Website"
];

const featureCards = [
  {
    icon: GitBranch,
    title: "Generate Social Media Posts",
    description: "Enter your command to instantly create engaging content.",
    category: "Content Creation"
  },
  {
    icon: FileText,
    title: "UI/UX Copy and Design", 
    description: "Provide your design goals, and Kronos GPT will draft precise copy suggestions.",
    category: "Design"
  },
  {
    icon: Search,
    title: "Marketing Strategy Creation",
    description: "Input your brief, and let the AI craft powerful marketing content.",
    category: "Strategy"
  },
  {
    icon: Calculator,
    title: "Project Updates",
    description: "Generate project timelines, to-do lists, and summaries in seconds.",
    category: "Project Management"
  }
];

export const WelcomeView = () => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setPrompt("");
    }, 2000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header Area */}
      <div className="text-center py-12 px-6">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-primary flex items-center justify-center animate-glow-pulse">
          <Zap className="h-8 w-8 text-primary-foreground" />
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Hi, <span className="text-primary">Developer!</span>
        </h1>
        
        <h2 className="text-4xl font-bold text-foreground mb-4">
          How can we help you today?
        </h2>
        
        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
          Let's get started! In a few simple steps, we'll show you how to 
          use CodeDrifer GPT to unlock your productivity.
        </p>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {promptSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-2 bg-accent-soft border border-primary/20 rounded-full text-sm text-primary hover:bg-primary/10 hover:border-primary/40 transition-all duration-200 glow-border"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Prompt Input */}
        <div className="max-w-2xl mx-auto">
          <div className="relative input-glow">
            <div className="flex gap-2 p-2 bg-card rounded-lg border border-border">
              <MessageSquare className="h-5 w-5 text-muted-foreground mt-2.5 ml-2" />
              <Input
                placeholder="Send CodeDrifer a message"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 border-0 bg-transparent focus:ring-0 text-foreground placeholder:text-muted-foreground"
              />
              <Button 
                onClick={handleSend}
                disabled={!prompt.trim() || isLoading}
                className="bg-gradient-primary hover:opacity-90 transition-opacity text-primary-foreground font-medium px-6"
              >
                {isLoading ? (
                  <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Send"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="flex-1 px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {featureCards.map((feature, index) => (
            <Card 
              key={index} 
              className="p-6 feature-card cursor-pointer glow-border bg-gradient-card border-border hover:border-primary/20 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {feature.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full">
                      {feature.category}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};