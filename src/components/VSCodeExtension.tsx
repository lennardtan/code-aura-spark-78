import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { MainWorkspace } from "./MainWorkspace";

export const VSCodeExtension = () => {
  const [selectedTab, setSelectedTab] = useState("home");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar 
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <MainWorkspace selectedTab={selectedTab} />
    </div>
  );
};