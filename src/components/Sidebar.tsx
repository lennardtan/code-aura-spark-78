import { useState } from "react";
import { 
  Search, 
  MessageSquare, 
  History, 
  GitBranch, 
  FileText, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SidebarProps {
  selectedTab: string;
  onTabChange: (tab: string) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

const sidebarItems = [
  { id: "home", icon: MessageSquare, label: "Ask CodeDrifer", badge: null },
  { id: "history", icon: History, label: "Documentation History", badge: null },
  { id: "explore", icon: Search, label: "Explore", badge: null },
];

const recentItems = [
  { id: "1", title: "Generate Instagram Caption", time: "Today" },
  { id: "2", title: "Create UI/UX Copy for Modal", time: "Today" },
  { id: "3", title: "Craft Engaging Facebook Post", time: "Yesterday" },
  { id: "4", title: "Write Blog Post on Remote Work", time: "Yesterday" },
  { id: "5", title: "Design Social Media Strategy", time: "3 days ago" },
  { id: "6", title: "Develop Landing Page Copy", time: "7 days ago" },
];

export const Sidebar = ({ selectedTab, onTabChange, isCollapsed, onToggle }: SidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className={cn(
      "bg-card border-r border-border transition-all duration-300 flex flex-col custom-scrollbar",
      isCollapsed ? "w-16" : "w-80"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">CD</span>
            </div>
            <span className="font-semibold text-foreground">CodeDrifer</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="h-8 w-8 p-0 hover:bg-muted"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="p-4">
          <div className="relative input-glow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200",
                selectedTab === item.id 
                  ? "sidebar-item-active text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </div>

        {/* Recent Items */}
        {!isCollapsed && (
          <div className="p-2 mt-6">
            <h3 className="px-3 py-2 text-sm font-medium text-muted-foreground">Recent</h3>
            <div className="space-y-1">
              {recentItems.map((item) => (
                <div
                  key={item.id}
                  className="px-3 py-2 rounded-lg hover:bg-muted cursor-pointer transition-colors duration-200 group"
                >
                  <div className="flex items-start gap-2">
                    <History className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground group-hover:text-primary transition-colors truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Upgrade Section */}
      {!isCollapsed && (
        <div className="p-4 border-t border-border">
          <div className="bg-gradient-card rounded-lg p-4 feature-card glow-border">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Unlock Premium</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Upgrade now to access advanced tools and faster results.
            </p>
            <Button className="w-full bg-gradient-primary hover:opacity-90 transition-opacity text-primary-foreground font-medium">
              Upgrade
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};