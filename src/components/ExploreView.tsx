import { useState } from "react";
import { 
  GitBranch,
  Download,
  Copy,
  FileText,
  Folder,
  ChevronDown,
  ChevronRight,
  Sparkles,
  MessageSquare,
  ExternalLink,
  CheckCircle,
  Loader2,
  Search,
  RefreshCw,
  AlertCircle,
  Github
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const sampleRepos = [
  "https://github.com/microsoft/vscode",
  "https://github.com/facebook/react", 
  "https://github.com/vercel/next.js"
];

const suggestedPrompts = [
  "Summarize this codebase",
  "List all functions in src/",
  "Highlight API endpoints",
  "Find configuration files",
  "Analyze project structure",
  "Extract documentation"
];

interface FileDigest {
  path: string;
  content: string;
  size: number;
  type: string;
}

interface RepoDigest {
  name: string;
  description: string;
  files: FileDigest[];
  structure: string[];
  summary: string;
  metadata?: {
    stars: number;
    forks: number;
    language: string;
    lastUpdated: string;
    branches: number;
  };
}

export const ExploreView = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [digest, setDigest] = useState<RepoDigest | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileDigest | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [chatQuery, setChatQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleIngestRepo = async () => {
    if (!repoUrl.trim()) return;
    
    setIsProcessing(true);
    setDigest(null);
    
    try {
      // Extract repo info from URL
      const urlParts = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (!urlParts) {
        throw new Error('Invalid GitHub URL format');
      }
      
      const [, owner, repo] = urlParts;
      const cleanRepo = repo.replace(/\.git$/, '');
      
      // Fetch repository information
      const [repoResponse, contentsResponse, branchesResponse] = await Promise.all([
        fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`),
        fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/contents`),
        fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/branches`)
      ]);
      
      if (!repoResponse.ok) {
        throw new Error('Repository not found or not accessible');
      }
      
      const repoData = await repoResponse.json();
      const contentsData = await contentsResponse.json();
      const branchesData = await branchesResponse.json();
      
      // Fetch file contents for key files
      const files: FileDigest[] = [];
      const keyFiles = contentsData.filter((item: any) => 
        item.type === 'file' && 
        (item.name.endsWith('.md') || 
         item.name === 'package.json' || 
         item.name.endsWith('.js') || 
         item.name.endsWith('.ts') ||
         item.name.endsWith('.json'))
      ).slice(0, 10); // Limit to first 10 files
      
      for (const file of keyFiles) {
        try {
          const fileResponse = await fetch(file.download_url);
          const content = await fileResponse.text();
          files.push({
            path: file.name,
            content: content.slice(0, 2000), // Limit content length
            size: file.size,
            type: file.name.split('.').pop() || 'unknown'
          });
        } catch (error) {
          console.error(`Failed to fetch ${file.name}:`, error);
        }
      }
      
      const repoDigest: RepoDigest = {
        name: repoData.name,
        description: repoData.description || 'No description available',
        files,
        structure: contentsData.map((item: any) => item.name),
        summary: `${repoData.name} is a ${repoData.language || 'multi-language'} repository with ${repoData.stargazers_count} stars and ${repoData.forks_count} forks. Last updated: ${new Date(repoData.updated_at).toLocaleDateString()}. ${branchesData.length} branches available.`,
        metadata: {
          stars: repoData.stargazers_count,
          forks: repoData.forks_count,
          language: repoData.language,
          lastUpdated: repoData.updated_at,
          branches: branchesData.length
        }
      };
      
      setDigest(repoDigest);
      setError(null);
    } catch (error) {
      console.error('Error fetching repository:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch repository');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRefresh = () => {
    if (repoUrl.trim()) {
      handleIngestRepo();
    }
  };

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const exportDigest = () => {
    if (!digest) return;
    const fullDigest = `# ${digest.name}\n\n${digest.description}\n\n## Summary\n${digest.summary}\n\n## Files\n\n${digest.files.map(file => `### ${file.path}\n\`\`\`\n${file.content}\n\`\`\``).join('\n\n')}`;
    const blob = new Blob([fullDigest], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${digest.name}-digest.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex">
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-3">Digest Any Git Repository Instantly</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Convert any public GitHub or Git repo into a clean text summary for fast analysis, AI assistants, or LLMs.
          </p>
        </div>

        {/* Input Card */}
        <Card className="p-8 feature-card glow-border bg-gradient-card border-border mb-8 max-w-4xl mx-auto">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Repository URL</label>
              <div className="relative input-glow">
                <GitBranch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="https://github.com/username/repository"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="pl-12 h-12 text-lg bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Button
                onClick={handleIngestRepo}
                disabled={isProcessing || !repoUrl.trim()}
                className="flex-1 sm:flex-none h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Generate Digest"
                )}
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRepoUrl(sampleRepos[0])}
                  className="text-primary border-primary/20 hover:bg-primary/10"
                >
                  Try Example
                </Button>
              </div>
            </div>

            {/* Sample Repos */}
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">Popular repositories to try:</p>
              <div className="flex flex-wrap gap-2">
                {sampleRepos.map((repo, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => setRepoUrl(repo)}
                    className="text-xs text-primary hover:text-primary-glow hover:bg-primary/10"
                  >
                    {repo.split('/').slice(-2).join('/')}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Error Display */}
        {error && (
          <Alert className="max-w-4xl mx-auto mb-6 border-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-destructive">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Digest Results */}
        {digest && (
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold text-foreground">{digest.name}</h2>
                    <Button
                      variant="ghost" 
                      size="sm"
                      onClick={handleRefresh}
                      disabled={isProcessing}
                      className="text-muted-foreground hover:text-primary"
                    >
                      <RefreshCw className={cn("h-4 w-4", isProcessing && "animate-spin")} />
                    </Button>
                  </div>
                  <p className="text-muted-foreground">{digest.description}</p>
                  {digest.metadata && (
                    <div className="flex items-center gap-3 mt-2">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Github className="h-3 w-3" />
                        {digest.metadata.stars} stars
                      </Badge>
                      <Badge variant="outline">{digest.metadata.forks} forks</Badge>
                      {digest.metadata.language && (
                        <Badge variant="outline">{digest.metadata.language}</Badge>
                      )}
                      <Badge variant="outline">{digest.metadata.branches} branches</Badge>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(digest.summary)}
                  className="text-primary border-primary/20 hover:bg-primary/10"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Summary
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportDigest}
                  className="text-primary border-primary/20 hover:bg-primary/10"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export All
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* File Tree */}
              <div className="lg:col-span-2">
                <Card className="p-6 feature-card glow-border bg-gradient-card border-border">
                  <div className="flex items-center gap-2 mb-4">
                    <Folder className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Repository Structure</h3>
                  </div>
                  <div className="space-y-2">
                    {digest.files.map((file, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedFile?.path === file.path
                            ? 'bg-primary/10 border border-primary/20'
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedFile(file)}
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">{file.path}</span>
                          <span className="text-xs text-muted-foreground ml-auto">{file.size} bytes</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* File Content */}
                {selectedFile && (
                  <Card className="p-6 feature-card glow-border bg-gradient-card border-border mt-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-foreground">{selectedFile.path}</h3>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(selectedFile.content)}
                        className="text-primary border-primary/20 hover:bg-primary/10"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                    <pre className="bg-muted/30 p-4 rounded-lg overflow-auto text-sm text-foreground whitespace-pre-wrap">
                      {selectedFile.content}
                    </pre>
                  </Card>
                )}
              </div>

              {/* Summary */}
              <div>
                <Card className="p-6 feature-card glow-border bg-gradient-card border-border">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">AI Summary</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{digest.summary}</p>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground">Suggested Analysis</h4>
                    {suggestedPrompts.map((prompt, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-left text-primary hover:text-primary-glow hover:bg-primary/10"
                        onClick={() => setChatQuery(prompt)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        {prompt}
                      </Button>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* How It Works */}
        {!digest && (
          <Card className="p-8 feature-card glow-border bg-gradient-card border-border max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold text-foreground mb-4">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <GitBranch className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-medium text-foreground mb-2">Paste Repository URL</h4>
                <p className="text-sm text-muted-foreground">
                  Enter any public GitHub, GitLab, or Git repository URL
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-medium text-foreground mb-2">AI Processing</h4>
                <p className="text-sm text-muted-foreground">
                  Our AI analyzes the codebase and generates a clean text digest
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Download className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-medium text-foreground mb-2">Export & Analyze</h4>
                <p className="text-sm text-muted-foreground">
                  Copy, export, or feed the digest to AI assistants and LLMs
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* AI Chat Sidebar */}
      {digest && (
        <div className="w-80 border-l border-border bg-background p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">AI Assistant</h3>
          </div>
          
          <div className="space-y-4">
            <div className="relative input-glow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                placeholder="Ask questions about the codebase..."
                value={chatQuery}
                onChange={(e) => setChatQuery(e.target.value)}
                className="pl-10 min-h-[100px] bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary resize-none"
              />
            </div>
            
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              <Sparkles className="h-4 w-4 mr-2" />
              Analyze
            </Button>
            
            <div className="pt-4 border-t border-border">
              <p className="text-sm font-medium text-foreground mb-3">Quick Actions</p>
              <div className="space-y-2">
                {suggestedPrompts.slice(0, 4).map((prompt, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-left text-primary hover:text-primary-glow hover:bg-primary/10"
                    onClick={() => setChatQuery(prompt)}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};