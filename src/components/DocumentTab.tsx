import { useState } from "react";
import { X, Plus, FileText, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface DocumentTab {
  id: string;
  title: string;
  isActive: boolean;
  isDirty: boolean;
}

interface DocumentTabsProps {
  tabs: DocumentTab[];
  onTabClick: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onTabRename: (tabId: string, newTitle: string) => void;
  onNewTab: () => void;
}

export const DocumentTabs = ({
  tabs,
  onTabClick,
  onTabClose,
  onTabRename,
  onNewTab
}: DocumentTabsProps) => {
  const [editingTab, setEditingTab] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleTabDoubleClick = (tab: DocumentTab) => {
    setEditingTab(tab.id);
    setEditValue(tab.title);
  };

  const handleEditComplete = () => {
    if (editingTab && editValue.trim()) {
      onTabRename(editingTab, editValue.trim());
    }
    setEditingTab(null);
    setEditValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditComplete();
    } else if (e.key === 'Escape') {
      setEditingTab(null);
      setEditValue("");
    }
  };

  return (
    <div className="flex items-center bg-card border-b border-border">
      <div className="flex flex-1 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={cn(
              "group flex items-center min-w-0 max-w-48 border-r border-border",
              "hover:bg-card-hover transition-colors duration-200",
              tab.isActive && "bg-background border-b-2 border-b-primary"
            )}
          >
            <div
              className="flex items-center flex-1 min-w-0 px-3 py-2 cursor-pointer"
              onClick={() => onTabClick(tab.id)}
              onDoubleClick={() => handleTabDoubleClick(tab)}
            >
              <FileText className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
              
              {editingTab === tab.id ? (
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={handleEditComplete}
                  onKeyDown={handleKeyDown}
                  className="h-6 px-1 py-0 text-sm border-none bg-input focus:ring-1 focus:ring-primary"
                  autoFocus
                />
              ) : (
                <div className="flex items-center min-w-0">
                  <span className="text-sm truncate text-foreground">
                    {tab.title}
                  </span>
                  {tab.isDirty && (
                    <Circle className="h-2 w-2 ml-1 text-primary fill-current flex-shrink-0" />
                  )}
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-6 w-6 p-0 mr-1 opacity-0 group-hover:opacity-100 transition-opacity",
                "hover:bg-destructive hover:text-destructive-foreground"
              )}
              onClick={(e) => {
                e.stopPropagation();
                onTabClose(tab.id);
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onNewTab}
        className="h-8 w-8 p-0 mr-2 hover:bg-card-hover border-l border-border"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};