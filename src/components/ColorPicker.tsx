import { useState } from "react";
import { Palette, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  onColorSelect: (color: string) => void;
  currentColor?: string;
}

const colorPalette = [
  // Basic colors
  { name: "Black", value: "#000000" },
  { name: "Dark Gray", value: "#374151" },
  { name: "Gray", value: "#6B7280" },
  { name: "Light Gray", value: "#9CA3AF" },
  { name: "White", value: "#FFFFFF" },
  
  // Brand colors
  { name: "Primary", value: "#0EA5E9" },
  { name: "Primary Light", value: "#38BDF8" },
  { name: "Primary Dark", value: "#0284C7" },
  
  // Accent colors
  { name: "Red", value: "#EF4444" },
  { name: "Orange", value: "#F97316" },
  { name: "Amber", value: "#F59E0B" },
  { name: "Yellow", value: "#EAB308" },
  { name: "Lime", value: "#84CC16" },
  { name: "Green", value: "#22C55E" },
  { name: "Emerald", value: "#10B981" },
  { name: "Teal", value: "#14B8A6" },
  { name: "Cyan", value: "#06B6D4" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Indigo", value: "#6366F1" },
  { name: "Violet", value: "#8B5CF6" },
  { name: "Purple", value: "#A855F7" },
  { name: "Fuchsia", value: "#D946EF" },
  { name: "Pink", value: "#EC4899" },
  { name: "Rose", value: "#F43F5E" },
];

export const ColorPicker = ({ onColorSelect, currentColor }: ColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleColorSelect = (color: string) => {
    onColorSelect(color);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-muted relative"
        >
          <Palette className="h-4 w-4" />
          {currentColor && (
            <div 
              className="absolute bottom-0 right-0 w-2 h-2 rounded-full border border-border"
              style={{ backgroundColor: currentColor }}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3 bg-popover border border-border" side="bottom" align="start">
        <div className="space-y-3">
          <div className="text-sm font-medium text-foreground">Text Color</div>
          
          <div className="grid grid-cols-8 gap-1">
            {colorPalette.map((color) => (
              <button
                key={color.value}
                onClick={() => handleColorSelect(color.value)}
                className={cn(
                  "w-6 h-6 rounded border border-border hover:scale-110 transition-transform relative",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                )}
                style={{ backgroundColor: color.value }}
                title={color.name}
              >
                {currentColor === color.value && (
                  <Check className="h-3 w-3 absolute inset-0 m-auto text-white drop-shadow-sm" />
                )}
              </button>
            ))}
          </div>
          
          <div className="pt-2 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleColorSelect("")}
              className="w-full justify-start text-sm hover:bg-muted"
            >
              Remove color
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};