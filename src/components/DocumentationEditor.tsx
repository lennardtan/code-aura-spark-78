import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { 
  Bold, 
  Italic, 
  Underline,
  Heading1,
  Heading2, 
  Heading3,
  List,
  ListOrdered,
  ImageIcon,
  Palette,
  Save,
  Share2,
  Users,
  ArrowLeft,
  Eye,
  EyeOff,
  MessageSquare,
  Send,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface DocumentationEditorProps {
  documentId: string;
  onBack: () => void;
}

const collaborators = [
  { id: "1", name: "Sarah Chen", avatar: "SC", color: "bg-blue-500" },
  { id: "2", name: "Mike Johnson", avatar: "MJ", color: "bg-green-500" },
  { id: "3", name: "Alex Rivera", avatar: "AR", color: "bg-purple-500" }
];

const aiSuggestions = [
  "Add API endpoint documentation",
  "Include code examples",
  "Explain error handling",
  "Add authentication flow"
];

const chatMessages = [
  { id: "1", user: "AI Assistant", message: "I've analyzed your code changes. Would you like me to generate documentation for the new API endpoints?", isAi: true },
  { id: "2", user: "You", message: "Yes, please focus on the authentication endpoints", isAi: false },
  { id: "3", user: "AI Assistant", message: "Here's a summary of the auth endpoints with examples. Should I add error handling documentation?", isAi: true }
];

export const DocumentationEditor = ({ documentId, onBack }: DocumentationEditorProps) => {
  const [showSummary, setShowSummary] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(true);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      TextStyle,
      Color,
    ],
    content: `
      <h1>API Documentation</h1>
      <p>This document outlines the REST API endpoints and authentication flow for our application.</p>
      
      <h2>Authentication</h2>
      <p>All API requests require authentication using Bearer tokens. Include the token in the Authorization header:</p>
      
      <h3>Login Endpoint</h3>
      <p><strong>POST /api/auth/login</strong></p>
      <p>Authenticates a user and returns an access token.</p>
      
      <h2>User Management</h2>
      <p>Endpoints for managing user accounts and profiles.</p>
    `,
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none min-h-[500px] focus:outline-none p-6',
      },
    },
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    setChatInput("");
    // Add message logic here
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="flex-1 flex h-screen bg-background">
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack}
                className="hover:bg-muted"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to History
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <h1 className="text-xl font-semibold text-foreground">API Documentation</h1>
              <Badge variant="secondary" className="bg-green-500/10 text-green-400">
                Live
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              {/* Collaborators */}
              <div className="flex -space-x-2">
                {collaborators.map((collaborator) => (
                  <Avatar key={collaborator.id} className={cn("h-8 w-8 border-2 border-background", collaborator.color)}>
                    <span className="text-xs font-medium text-white">{collaborator.avatar}</span>
                  </Avatar>
                ))}
              </div>

              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowSummary(!showSummary)}
                className="border-border hover:bg-muted"
              >
                {showSummary ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showSummary ? "Hide Summary" : "Show Summary"}
              </Button>

              <Button 
                variant="outline" 
                size="sm"
                className="border-border hover:bg-muted"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>

              <Button 
                onClick={handleSave}
                disabled={isSaving}
                className="bg-gradient-primary hover:opacity-90 text-primary-foreground"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Editor Toolbar & Content */}
          <div className="flex-1 flex flex-col">
            {/* Toolbar */}
            <div className="border-b border-border bg-card p-3">
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                  className={cn(
                    "hover:bg-muted",
                    editor.isActive('heading', { level: 1 }) && "bg-muted text-primary"
                  )}
                >
                  <Heading1 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={cn(
                    "hover:bg-muted",
                    editor.isActive('heading', { level: 2 }) && "bg-muted text-primary"
                  )}
                >
                  <Heading2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                  className={cn(
                    "hover:bg-muted",
                    editor.isActive('heading', { level: 3 }) && "bg-muted text-primary"
                  )}
                >
                  <Heading3 className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-6 mx-2" />

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={cn(
                    "hover:bg-muted",
                    editor.isActive('bold') && "bg-muted text-primary"
                  )}
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={cn(
                    "hover:bg-muted",
                    editor.isActive('italic') && "bg-muted text-primary"
                  )}
                >
                  <Italic className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-6 mx-2" />

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={cn(
                    "hover:bg-muted",
                    editor.isActive('bulletList') && "bg-muted text-primary"
                  )}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={cn(
                    "hover:bg-muted",
                    editor.isActive('orderedList') && "bg-muted text-primary"
                  )}
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-6 mx-2" />

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const url = window.prompt('Enter image URL:');
                    if (url) {
                      editor.chain().focus().setImage({ src: url }).run();
                    }
                  }}
                  className="hover:bg-muted"
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().setColor('#3B82F6').run()}
                  className="hover:bg-muted"
                >
                  <Palette className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Editor Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-4xl mx-auto">
                <EditorContent editor={editor} />
              </div>
            </div>
          </div>

          {/* Summary Panel */}
          {showSummary && (
            <div className="w-80 border-l border-border bg-card p-4">
              <h3 className="font-semibold text-foreground mb-4">Documentation Summary</h3>
              <div className="space-y-3">
                <Card className="p-3 bg-gradient-card border-border">
                  <h4 className="font-medium text-foreground text-sm mb-2">Auto-generated from code</h4>
                  <p className="text-xs text-muted-foreground">
                    15 API endpoints detected, 8 new since last version
                  </p>
                </Card>
                <Card className="p-3 bg-gradient-card border-border">
                  <h4 className="font-medium text-foreground text-sm mb-2">Key Changes</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Added OAuth 2.0 support</li>
                    <li>• New user management endpoints</li>
                    <li>• Updated error response format</li>
                  </ul>
                </Card>
                <Card className="p-3 bg-gradient-card border-border">
                  <h4 className="font-medium text-foreground text-sm mb-2">AI Suggestions</h4>
                  <div className="space-y-2">
                    {aiSuggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="w-full text-left text-xs justify-start hover:bg-muted"
                      >
                        <Sparkles className="h-3 w-3 mr-2" />
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Chatbot Sidebar */}
      {isChatOpen && (
        <div className="w-80 border-l border-border bg-card flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-semibold text-foreground">AI Assistant</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChatOpen(false)}
                className="hover:bg-muted"
              >
                <EyeOff className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((message) => (
              <div key={message.id} className={cn(
                "flex gap-3",
                !message.isAi && "flex-row-reverse"
              )}>
                <Avatar className={cn(
                  "h-8 w-8",
                  message.isAi ? "bg-gradient-primary" : "bg-muted"
                )}>
                  <span className="text-xs font-medium">
                    {message.isAi ? "AI" : "U"}
                  </span>
                </Avatar>
                <Card className={cn(
                  "p-3 max-w-[240px]",
                  message.isAi 
                    ? "bg-gradient-card border-border" 
                    : "bg-primary text-primary-foreground border-primary"
                )}>
                  <p className="text-sm">{message.message}</p>
                </Card>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                placeholder="Ask about documentation..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 bg-input border-border"
              />
              <Button 
                onClick={sendMessage}
                size="sm"
                className="bg-gradient-primary hover:opacity-90 text-primary-foreground"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Toggle Button (when closed) */}
      {!isChatOpen && (
        <Button
          onClick={() => setIsChatOpen(true)}
          className="fixed right-4 bottom-4 w-12 h-12 rounded-full bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-lg"
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};