"use client";

import type React from "react";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { X, Pin, PinOff, Trash, MoreHorizontalIcon } from "lucide-react";
import { Button } from "../button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export type StickyNoteColor =
  | "yellow"
  | "blue"
  | "green"
  | "pink"
  | "purple"
  | "orange";

export interface StickyNoteProps {
  id: string;
  title: string;
  description: string;
  color: StickyNoteColor;
  isPinned: boolean;
  isExpanded?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onUpdate?: (
    id: string,
    title: string,
    description: string,
    color: StickyNoteColor
  ) => void;
  onDelete?: (id: string) => void;
  onTogglePin?: (id: string) => void;
}

const colorClasses: Record<
  StickyNoteColor,
  { bg: string; hoverBg: string; border: string; ring: string }
> = {
  yellow: {
    bg: "bg-yellow-100/80",
    hoverBg: "hover:bg-yellow-100/90",
    border: "border-yellow-200",
    ring: "ring-yellow-300",
  },
  blue: {
    bg: "bg-blue-100/80",
    hoverBg: "hover:bg-blue-100/90",
    border: "border-blue-200",
    ring: "ring-blue-300",
  },
  green: {
    bg: "bg-green-100/80",
    hoverBg: "hover:bg-green-100/90",
    border: "border-green-200",
    ring: "ring-green-300",
  },
  pink: {
    bg: "bg-pink-100/80",
    hoverBg: "hover:bg-pink-100/90",
    border: "border-pink-200",
    ring: "ring-pink-300",
  },
  purple: {
    bg: "bg-purple-100/80",
    hoverBg: "hover:bg-purple-100/90",
    border: "border-purple-200",
    ring: "ring-purple-300",
  },
  orange: {
    bg: "bg-orange-100/80",
    hoverBg: "hover:bg-orange-100/90",
    border: "border-orange-200",
    ring: "ring-orange-300",
  },
};

export function StickyNote({
  id,
  title,
  description,
  color,
  isPinned,
  isExpanded: externalIsExpanded,
  onOpen,
  onClose,
  onUpdate,
  onDelete,
  onTogglePin,
}: StickyNoteProps) {
  console.log("StickyNote props:", { id, title, description, color, isPinned });

  const [isExpandedInternal, setIsExpandedInternal] = useState(false);
  const isExpanded =
    externalIsExpanded !== undefined ? externalIsExpanded : isExpandedInternal;
  const [currentTitle, setCurrentTitle] = useState(title);
  const [currentDescription, setCurrentDescription] = useState(description);
  const [currentColor, setCurrentColor] = useState<StickyNoteColor>(color);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const isNewNote = title === "" && description === "";
  const [lastKeyWasEnter, setLastKeyWasEnter] = useState(false);

  useEffect(() => {
    if (isExpanded && isNewNote && titleRef.current) {
      titleRef.current.focus();
    }
  }, [isExpanded, isNewNote]);

  const saveChanges = useCallback(
    () => {
      if (onUpdate) {
        onUpdate(id, currentTitle, currentDescription, currentColor);
      }
    }, [id, currentTitle, currentDescription, currentColor, onUpdate]
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isExpanded && !target.closest(".sticky-note-content")) {
        saveChanges();
        if (onClose) {
          onClose();
        } else {
          setIsExpandedInternal(false);
        }
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded, currentTitle, currentDescription, currentColor, onClose, saveChanges]);

  const handleDelete = (e: React.MouseEvent | React.KeyboardEvent) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    if (onDelete) {
      onDelete(id);
    }
    if (onClose) {
      onClose();
    }
  };

  const handleColorChange = (newColor: StickyNoteColor) => {
    setCurrentColor(newColor);
  };

  const handleOpen = () => {
    if (onOpen) {
      onOpen();
      console.log(isHovered);
    } else {
      setIsExpandedInternal(true);
    }
  };

  const handleClose = () => {
    saveChanges();
    if (onClose) {
      onClose();
    } else {
      setIsExpandedInternal(false);
    }
  };

  const handleTogglePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onTogglePin) {
      onTogglePin(id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      const textarea = e.currentTarget;
      const { selectionStart } = textarea;
      const currentValue = textarea.value;
      const currentLine =
        currentValue.substring(0, selectionStart).split("\n").pop() || "";

      // Check if we should exit list mode on double Enter
      if (
        lastKeyWasEnter &&
        (currentLine.trim() === "- " ||
          currentLine.trim() === "1. " ||
          currentLine.trim() === "")
      ) {
        e.preventDefault();
        const newValue =
          currentValue.substring(0, selectionStart - 2) +
          "\n" +
          currentValue.substring(selectionStart);
        setCurrentDescription(newValue);

        // Set cursor position after the new line
        setTimeout(() => {
          if (textarea) {
            textarea.selectionStart = selectionStart - 1;
            textarea.selectionEnd = selectionStart - 1;
          }
        }, 0);

        setLastKeyWasEnter(false);
        return;
      }

      // Check for bullet points or numbered lists
      const bulletMatch = currentLine.match(/^(\s*)-\s/);
      const numberMatch = currentLine.match(/^(\s*)(\d+)\.\s/);

      if (bulletMatch || numberMatch) {
        e.preventDefault();
        let prefix = "";

        if (bulletMatch) {
          prefix = bulletMatch[1] + "- ";
        } else if (numberMatch) {
          const indent = numberMatch[1];
          const num = Number.parseInt(numberMatch[2]) + 1;
          prefix = `${indent}${num}. `;
        }

        const newValue =
          currentValue.substring(0, selectionStart) +
          "\n" +
          prefix +
          currentValue.substring(selectionStart);
        setCurrentDescription(newValue);

        // Set cursor position after the prefix
        setTimeout(() => {
          if (textarea) {
            const newPosition = selectionStart + 1 + prefix.length;
            textarea.selectionStart = newPosition;
            textarea.selectionEnd = newPosition;
          }
        }, 0);

        setLastKeyWasEnter(true);
        return;
      }

      setLastKeyWasEnter(false);
    } else {
      setLastKeyWasEnter(false);
    }
  };

  return (
    <>
      {/* Mini view */}
      <div
        className={cn(
          "sticky-note cursor-pointer rounded-md p-3 border shadow-sm transition-all duration-200 relative",
          "backdrop-blur-sm transform hover:-translate-y-1 hover:shadow-md",
          colorClasses[currentColor].bg,
          colorClasses[currentColor].hoverBg,
          colorClasses[currentColor].border,
          isExpanded ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
        onClick={handleOpen}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-xs line-clamp-1 pr-6">
            {currentTitle || currentDescription}
          </h3>
        </div>
      </div>

      {/* Expanded overlay view */}
      {isExpanded && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className={cn(
              "sticky-note-content relative w-full max-w-md rounded-lg shadow-lg border p-4",
              "backdrop-blur-md transition-all duration-200",
              colorClasses[currentColor].bg,
              colorClasses[currentColor].border
            )}
          >
            <div className="absolute top-2 right-2 flex gap-1">
              {/* Dropdown for delete action */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    className="p-1 text-black/50 rounded-full hover:bg-black/10 transition-colors"
                    disabled={
                      !currentTitle.trim() && !currentDescription.trim()
                    }
                  >
                    <MoreHorizontalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="flex justify-between"
                  >
                    Delete
                    <Trash className="h-4 w-4 text-gray-500" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                size="icon"
                variant="ghost"
                disabled={!currentTitle.trim() && !currentDescription.trim()}
                onClick={handleTogglePin}
                className="p-1 text-black/50 rounded-full hover:bg-black/10 transition-colors"
                title={isPinned ? "Unpin note" : "Pin note"}
              >
                {isPinned ? (
                  <Pin className="h-4 w-4 fill-current" />
                ) : (
                  <PinOff className="h-4 w-4" />
                )}
              </Button>
              <Button
                onClick={handleClose}
                variant="ghost"
                size="icon"
                className="p-1 text-black/50  rounded-full hover:bg-black/10 transition-colors"
                title="Close and dont save"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-2 mb-3">
              {(Object.keys(colorClasses) as StickyNoteColor[]).map(
                (colorOption) => (
                  <button
                    key={colorOption}
                    className={cn(
                      "w-5 h-5 rounded-full border border-black/5",
                      colorClasses[colorOption].bg,
                      currentColor === colorOption && "ring-2",
                      currentColor === colorOption &&
                        colorClasses[colorOption].ring
                    )}
                    onClick={() => handleColorChange(colorOption)}
                  />
                )
              )}
            </div>

            <div className="space-y-2">
              <input
                ref={titleRef}
                type="text"
                value={currentTitle}
                onChange={(e) => setCurrentTitle(e.target.value)}
                placeholder="Title"
                className="w-full bg-transparent border-none outline-none font-medium text-lg placeholder-gray-400"
              />
              <textarea
                ref={descriptionRef}
                value={currentDescription}
                onChange={(e) => setCurrentDescription(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Description"
                className="w-full bg-transparent border-none outline-none resize-none min-h-[100px] text-sm placeholder-gray-400"
              />
            </div>

            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={!currentTitle.trim() && !currentDescription.trim()}
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
