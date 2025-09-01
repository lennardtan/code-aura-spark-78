import { useState } from "react";
import { 
  Clock, 
  GitCommit, 
  FileText, 
  ChevronRight,
  Filter,
  Search,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const historyItems = [
  {
    id: "1",
    title: "API Documentation Changes",
    description: "Summarized changes to REST API endpoints and authentication flow",
    timestamp: "2 hours ago",
    type: "documentation",
    status: "completed",
    changes: 15
  },
  {
    id: "2", 
    title: "Database Schema Updates",
    description: "Analyzed migration scripts and table structure modifications",
    timestamp: "5 hours ago",
    type: "database",
    status: "completed",
    changes: 8
  },
  {
    id: "3",
    title: "React Component Refactoring",
    description: "Generated summary of component prop changes and hook updates",
    timestamp: "1 day ago", 
    type: "code",
    status: "completed",
    changes: 23
  },
  {
    id: "4",
    title: "GitHub PR Analysis",
    description: "Compared feature branch changes with main branch",
    timestamp: "2 days ago",
    type: "git",
    status: "completed", 
    changes: 42
  },
  {
    id: "5",
    title: "Configuration File Updates",
    description: "Tracked changes to environment variables and build settings",
    timestamp: "3 days ago",
    type: "config",
    status: "completed",
    changes: 7
  }
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case "documentation": return FileText;
    case "database": return GitCommit;  
    case "code": return GitCommit;
    case "git": return GitCommit;
    case "config": return FileText;
    default: return FileText;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "documentation": return "text-blue-400 bg-blue-400/10";
    case "database": return "text-purple-400 bg-purple-400/10";
    case "code": return "text-green-400 bg-green-400/10"; 
    case "git": return "text-orange-400 bg-orange-400/10";
    case "config": return "text-yellow-400 bg-yellow-400/10";
    default: return "text-gray-400 bg-gray-400/10";
  }
};

interface HistoryViewProps {
  onViewDocument?: (documentId: string) => void;
}

export const HistoryView = ({ onViewDocument }: HistoryViewProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filteredItems = historyItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === "all" || item.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Documentation History</h1>
        <p className="text-muted-foreground">Review your previous documentation edits and analysis sessions</p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative input-glow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search analysis history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          {["all", "documentation", "code", "git", "database", "config"].map((filter) => (
            <Button
              key={filter}
              variant={selectedFilter === filter ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(filter)}
              className={selectedFilter === filter 
                ? "bg-gradient-primary text-primary-foreground" 
                : "border-border hover:bg-muted"
              }
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* History Items */}
      <div className="space-y-4">
        {filteredItems.map((item) => {
          const Icon = getTypeIcon(item.type);
          const typeColors = getTypeColor(item.type);
          
          return (
            <Card 
              key={item.id}
              className="p-6 feature-card cursor-pointer glow-border bg-gradient-card border-border hover:border-primary/20 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${typeColors}`}>
                  <Icon className="h-5 w-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-foreground text-lg">{item.title}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{item.timestamp}</span>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{item.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className={`text-sm font-medium px-2 py-1 rounded-full ${typeColors}`}>
                        {item.type}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {item.changes} changes analyzed
                      </span>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onViewDocument?.(item.id)}
                      className="text-primary hover:text-primary-glow hover:bg-primary/10"
                    >
                      View Details
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Clock className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No history found</h3>
          <p className="text-muted-foreground">
            {searchQuery ? "Try adjusting your search terms" : "Start analyzing your code to see history here"}
          </p>
        </div>
      )}
    </div>
  );
};