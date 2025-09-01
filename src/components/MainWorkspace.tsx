import { useState } from "react";
import { WelcomeView } from "./WelcomeView";
import { HistoryView } from "./HistoryView";
import { ExploreView } from "./ExploreView";
import { DocumentationEditor } from "./DocumentationEditor";

interface MainWorkspaceProps {
  selectedTab: string;
}

export const MainWorkspace = ({ selectedTab }: MainWorkspaceProps) => {
  const [currentView, setCurrentView] = useState<"main" | "editor">("main");
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(null);

  const handleViewDocument = (documentId: string) => {
    setCurrentDocumentId(documentId);
    setCurrentView("editor");
  };

  const handleBackToHistory = () => {
    setCurrentView("main");
    setCurrentDocumentId(null);
  };

  if (currentView === "editor" && currentDocumentId) {
    return (
      <DocumentationEditor 
        documentId={currentDocumentId}
        onBack={handleBackToHistory}
      />
    );
  }

  const renderContent = () => {
    switch (selectedTab) {
      case "history":
        return <HistoryView onViewDocument={handleViewDocument} />;
      case "explore":
        return <ExploreView />;
      default:
        return <WelcomeView />;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background">
      {renderContent()}
    </div>
  );
};