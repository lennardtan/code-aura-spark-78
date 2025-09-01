import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Collaborator {
  id: string;
  name: string;
  color: string;
  avatar: string;
}

interface CursorPosition {
  userId: string;
  x: number;
  y: number;
  visible: boolean;
}

interface CollaboratorCursorsProps {
  collaborators: Collaborator[];
  cursorPositions: CursorPosition[];
}

export const CollaboratorCursors = ({ collaborators, cursorPositions }: CollaboratorCursorsProps) => {
  return (
    <>
      {cursorPositions.map((position) => {
        const collaborator = collaborators.find(c => c.id === position.userId);
        if (!collaborator || !position.visible) return null;

        return (
          <div
            key={position.userId}
            className="fixed pointer-events-none z-50 transition-all duration-100"
            style={{
              left: position.x,
              top: position.y,
            }}
          >
            {/* Cursor */}
            <div 
              className="w-5 h-5 rotate-45 border-2 border-background"
              style={{ backgroundColor: collaborator.color }}
            />
            
            {/* Name label */}
            <div 
              className="absolute top-6 left-0 px-2 py-1 rounded-md text-xs font-medium text-white whitespace-nowrap"
              style={{ backgroundColor: collaborator.color }}
            >
              {collaborator.name}
            </div>
          </div>
        );
      })}
    </>
  );
};

interface SelectionHighlight {
  userId: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  height: number;
}

interface CollaboratorSelectionsProps {
  collaborators: Collaborator[];
  selections: SelectionHighlight[];
}

export const CollaboratorSelections = ({ collaborators, selections }: CollaboratorSelectionsProps) => {
  return (
    <>
      {selections.map((selection, index) => {
        const collaborator = collaborators.find(c => c.id === selection.userId);
        if (!collaborator) return null;

        return (
          <div
            key={`${selection.userId}-${index}`}
            className="fixed pointer-events-none z-40 opacity-30"
            style={{
              left: selection.startX,
              top: selection.startY,
              width: selection.endX - selection.startX,
              height: selection.height,
              backgroundColor: collaborator.color,
            }}
          />
        );
      })}
    </>
  );
};