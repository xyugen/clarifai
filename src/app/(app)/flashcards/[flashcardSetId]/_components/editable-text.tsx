"use client";

import { Input } from "@/components/retroui/Input";
import { Textarea } from "@/components/retroui/Textarea";
import { cn } from "@/lib/utils";
import { Check, Pencil, X } from "lucide-react";
import { useState } from "react";

interface EditableTextProps {
  value: string;
  onSave: (value: string) => void;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  as?: "h1" | "h2" | "p";
  canEdit?: boolean;
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onSave,
  className = "",
  placeholder = "Enter text",
  multiline = false,
  as = "p",
  canEdit = true,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    if (editValue.trim() && editValue !== value) {
      onSave(editValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (!canEdit) {
    const Tag = as;
    return <Tag className={className}>{value}</Tag>;
  }

  if (isEditing) {
    return (
      <div className="flex items-start gap-2">
        {multiline ? (
          <Textarea
            value={editValue}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setEditValue(e.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={cn("flex-1", className)}
            autoFocus
          />
        ) : (
          <Input
            value={editValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEditValue(e.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={cn("flex-1", className)}
            autoFocus
          />
        )}
        <div className="flex gap-1">
          <button
            onClick={handleSave}
            className="flex h-10 w-10 items-center justify-center border-2 border-black bg-green-400 transition hover:bg-green-500"
            aria-label="Save"
          >
            <Check className="size-5" strokeWidth={3} />
          </button>
          <button
            onClick={handleCancel}
            className="flex h-10 w-10 items-center justify-center border-2 border-black bg-red-400 transition hover:bg-red-500"
            aria-label="Cancel"
          >
            <X className="size-5" strokeWidth={3} />
          </button>
        </div>
      </div>
    );
  }

  const Tag = as;
  return (
    <div className="group relative inline-block w-full">
      <Tag className={className}>{value}</Tag>
      <button
        onClick={() => setIsEditing(true)}
        className="absolute -right-10 top-1/2 -translate-y-1/2 opacity-0 transition group-hover:opacity-100"
        aria-label="Edit"
      >
        <div className="flex h-8 w-8 items-center justify-center border-2 border-black bg-purple-300 hover:bg-purple-400">
          <Pencil className="size-4" strokeWidth={3} />
        </div>
      </button>
    </div>
  );
};
