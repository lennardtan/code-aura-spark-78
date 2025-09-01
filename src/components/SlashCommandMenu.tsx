import { useState, useEffect } from "react";
import { 
  Heading1, Heading2, Heading3, 
  List, ListOrdered, 
  Quote, Minus, Code2, 
  Image as ImageIcon, Video, FileIcon, Link2,
  Table, CheckSquare, Lightbulb,
  Palette, Hash, AtSign,
  Sparkles, MessageSquare, Search
} from "lucide-react";
import { Command, CommandInput, CommandItem, CommandList, CommandGroup } from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface SlashCommand {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  keywords: string[];
  category: 'suggested' | 'basic' | 'media' | 'database' | 'ai';
  action: () => void;
}

interface SlashCommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onCommand: (command: SlashCommand) => void;
  position: { top: number; left: number };
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const SlashCommandMenu = ({
  isOpen,
  onClose,
  onCommand,
  position,
  searchQuery,
  onSearchChange
}: SlashCommandMenuProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filteredCommands, setFilteredCommands] = useState<SlashCommand[]>([]);

  const commands: SlashCommand[] = [
    // Suggested
    {
      id: 'bulleted-list',
      title: 'Bulleted list',
      description: 'Create a simple bulleted list',
      icon: List,
      keywords: ['list', 'bullet', 'ul'],
      category: 'suggested',
      action: () => {}
    },
    {
      id: 'divider',
      title: 'Divider',
      description: 'Visually divide blocks',
      icon: Minus,
      keywords: ['divider', 'separator', 'hr'],
      category: 'suggested',
      action: () => {}
    },
    {
      id: 'code',
      title: 'Code',
      description: 'Create a code block',
      icon: Code2,
      keywords: ['code', 'snippet', 'programming'],
      category: 'suggested',
      action: () => {}
    },
    {
      id: 'heading-2',
      title: 'Heading 2',
      description: 'Medium section heading',
      icon: Heading2,
      keywords: ['heading', 'h2', 'title'],
      category: 'suggested',
      action: () => {}
    },

    // Basic blocks
    {
      id: 'text',
      title: 'Text',
      description: 'Just start writing with plain text',
      icon: Hash,
      keywords: ['text', 'paragraph', 'plain'],
      category: 'basic',
      action: () => {}
    },
    {
      id: 'heading-1',
      title: 'Heading 1',
      description: 'Big section heading',
      icon: Heading1,
      keywords: ['heading', 'h1', 'title', 'large'],
      category: 'basic',
      action: () => {}
    },
    {
      id: 'heading-3',
      title: 'Heading 3',
      description: 'Small section heading',
      icon: Heading3,
      keywords: ['heading', 'h3', 'title', 'small'],
      category: 'basic',
      action: () => {}
    },
    {
      id: 'numbered-list',
      title: 'Numbered list',
      description: 'Create a list with numbering',
      icon: ListOrdered,
      keywords: ['list', 'numbered', 'ordered', 'ol'],
      category: 'basic',
      action: () => {}
    },
    {
      id: 'checkbox',
      title: 'To-do list',
      description: 'Track tasks with a to-do list',
      icon: CheckSquare,
      keywords: ['todo', 'task', 'checkbox', 'check'],
      category: 'basic',
      action: () => {}
    },
    {
      id: 'quote',
      title: 'Quote',
      description: 'Capture a quote',
      icon: Quote,
      keywords: ['quote', 'blockquote', 'citation'],
      category: 'basic',
      action: () => {}
    },
    {
      id: 'callout',
      title: 'Callout',
      description: 'Make writing stand out',
      icon: Lightbulb,
      keywords: ['callout', 'note', 'info', 'warning'],
      category: 'basic',
      action: () => {}
    },

    // Media
    {
      id: 'image',
      title: 'Image',
      description: 'Upload or embed with a link',
      icon: ImageIcon,
      keywords: ['image', 'picture', 'photo', 'upload'],
      category: 'media',
      action: () => {}
    },
    {
      id: 'video',
      title: 'Video',
      description: 'Embed a video',
      icon: Video,
      keywords: ['video', 'embed', 'youtube', 'vimeo'],
      category: 'media',
      action: () => {}
    },
    {
      id: 'file',
      title: 'File',
      description: 'Upload a file',
      icon: FileIcon,
      keywords: ['file', 'upload', 'attachment'],
      category: 'media',
      action: () => {}
    },
    {
      id: 'bookmark',
      title: 'Web bookmark',
      description: 'Save a link to any web page',
      icon: Link2,
      keywords: ['bookmark', 'link', 'url', 'web'],
      category: 'media',
      action: () => {}
    },

    // Database
    {
      id: 'table',
      title: 'Table',
      description: 'Add a simple table',
      icon: Table,
      keywords: ['table', 'grid', 'data'],
      category: 'database',
      action: () => {}
    },

    // AI
    {
      id: 'ai-summary',
      title: 'AI Summary',
      description: 'Summarize the content above',
      icon: Sparkles,
      keywords: ['ai', 'summary', 'summarize'],
      category: 'ai',
      action: () => {}
    },
    {
      id: 'ai-explain',
      title: 'AI Explain',
      description: 'Explain selected code or text',
      icon: MessageSquare,
      keywords: ['ai', 'explain', 'code', 'help'],
      category: 'ai',
      action: () => {}
    }
  ];

  useEffect(() => {
    const filtered = commands.filter(command => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return command.title.toLowerCase().includes(query) ||
             command.description.toLowerCase().includes(query) ||
             command.keywords.some(keyword => keyword.includes(query));
    });
    setFilteredCommands(filtered);
    setSelectedIndex(0);
  }, [searchQuery]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev === 0 ? filteredCommands.length - 1 : prev - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        onCommand(filteredCommands[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const groupedCommands = {
    suggested: filteredCommands.filter(cmd => cmd.category === 'suggested'),
    basic: filteredCommands.filter(cmd => cmd.category === 'basic'),
    media: filteredCommands.filter(cmd => cmd.category === 'media'),
    database: filteredCommands.filter(cmd => cmd.category === 'database'),
    ai: filteredCommands.filter(cmd => cmd.category === 'ai')
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed z-50 w-80 bg-popover border border-border rounded-lg shadow-lg"
      style={{
        top: position.top,
        left: position.left,
      }}
      onKeyDown={handleKeyDown}
    >
      <Command className="bg-transparent">
        <div className="px-3 py-2 border-b border-border">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <CommandInput
              placeholder="Filter..."
              value={searchQuery}
              onValueChange={onSearchChange}
              className="pl-8 h-8 text-sm bg-input border-none focus:ring-1 focus:ring-primary"
              autoFocus
            />
          </div>
        </div>

        <CommandList className="max-h-64 overflow-y-auto">
          {groupedCommands.suggested.length > 0 && (
            <CommandGroup heading="Suggested" className="px-2">
              {groupedCommands.suggested.map((command, index) => {
                const globalIndex = filteredCommands.indexOf(command);
                return (
                  <CommandItem
                    key={command.id}
                    onSelect={() => onCommand(command)}
                    className={cn(
                      "flex items-center gap-3 px-2 py-2 cursor-pointer rounded-md",
                      "hover:bg-accent hover:text-accent-foreground",
                      globalIndex === selectedIndex && "bg-accent text-accent-foreground"
                    )}
                  >
                    <command.icon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-foreground">{command.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{command.description}</div>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}

          {groupedCommands.basic.length > 0 && (
            <CommandGroup heading="Basic blocks" className="px-2">
              {groupedCommands.basic.map((command) => {
                const globalIndex = filteredCommands.indexOf(command);
                return (
                  <CommandItem
                    key={command.id}
                    onSelect={() => onCommand(command)}
                    className={cn(
                      "flex items-center gap-3 px-2 py-2 cursor-pointer rounded-md",
                      "hover:bg-accent hover:text-accent-foreground",
                      globalIndex === selectedIndex && "bg-accent text-accent-foreground"
                    )}
                  >
                    <command.icon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-foreground">{command.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{command.description}</div>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}

          {groupedCommands.media.length > 0 && (
            <CommandGroup heading="Media" className="px-2">
              {groupedCommands.media.map((command) => {
                const globalIndex = filteredCommands.indexOf(command);
                return (
                  <CommandItem
                    key={command.id}
                    onSelect={() => onCommand(command)}
                    className={cn(
                      "flex items-center gap-3 px-2 py-2 cursor-pointer rounded-md",
                      "hover:bg-accent hover:text-accent-foreground",
                      globalIndex === selectedIndex && "bg-accent text-accent-foreground"
                    )}
                  >
                    <command.icon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-foreground">{command.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{command.description}</div>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}

          {groupedCommands.database.length > 0 && (
            <CommandGroup heading="Database" className="px-2">
              {groupedCommands.database.map((command) => {
                const globalIndex = filteredCommands.indexOf(command);
                return (
                  <CommandItem
                    key={command.id}
                    onSelect={() => onCommand(command)}
                    className={cn(
                      "flex items-center gap-3 px-2 py-2 cursor-pointer rounded-md",
                      "hover:bg-accent hover:text-accent-foreground",
                      globalIndex === selectedIndex && "bg-accent text-accent-foreground"
                    )}
                  >
                    <command.icon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-foreground">{command.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{command.description}</div>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}

          {groupedCommands.ai.length > 0 && (
            <CommandGroup heading="AI" className="px-2">
              {groupedCommands.ai.map((command) => {
                const globalIndex = filteredCommands.indexOf(command);
                return (
                  <CommandItem
                    key={command.id}
                    onSelect={() => onCommand(command)}
                    className={cn(
                      "flex items-center gap-3 px-2 py-2 cursor-pointer rounded-md",
                      "hover:bg-accent hover:text-accent-foreground",
                      globalIndex === selectedIndex && "bg-accent text-accent-foreground"
                    )}
                  >
                    <command.icon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-foreground">{command.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{command.description}</div>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </div>
  );
};