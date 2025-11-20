"use client";
import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { Input } from "@/components/retroui/Input";
import { Text } from "@/components/retroui/Text";
import { Textarea } from "@/components/retroui/Textarea";
import { cn } from "@/lib/utils";
import type { Flashcard } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { Check, Pencil, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface FlashcardViewProps {
  flashcards: Flashcard[];
  currentIndex: number;
  flashcardSetId: string;
  userId: string | null;
  authorId: string;
  onFlashcardUpdate: (flashcard: Flashcard) => void;
  onCardClick?: (index: number) => void;
}

const FlashcardView: React.FC<FlashcardViewProps> = ({
  flashcards,
  currentIndex,
  flashcardSetId,
  userId,
  authorId,
  onFlashcardUpdate,
  onCardClick,
}) => {
  const [hideTerm, setHideTerm] = useState(false);
  const [hideDefinition, setHideDefinition] = useState(false);
  const [editingFlashcardId, setEditingFlashcardId] = useState<string | null>(
    null,
  );
  const [editTerm, setEditTerm] = useState("");
  const [editDefinition, setEditDefinition] = useState("");

  const updateFlashcardMutation =
    api.flashcard.updateFlashcardContent.useMutation({
      onSuccess: (_, variables) => {
        toast.success("Flashcard updated successfully");
        const flashcard = flashcards.find((fc) => fc.id === variables.flashcardId);
        if (flashcard) {
          onFlashcardUpdate({
            ...flashcard,
            term: variables.term ?? flashcard.term,
            definition: variables.definition ?? flashcard.definition,
          });
        }
        setEditingFlashcardId(null);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update flashcard");
      },
    });

  const handleEdit = (flashcard: Flashcard) => {
    setEditingFlashcardId(flashcard.id);
    setEditTerm(flashcard.term);
    setEditDefinition(flashcard.definition);
  };

  const handleSave = (flashcardId: string) => {
    const flashcard = flashcards.find((fc) => fc.id === flashcardId);
    if (!flashcard) return;

    const updates: { term?: string; definition?: string } = {};
    if (editTerm !== flashcard.term) updates.term = editTerm;
    if (editDefinition !== flashcard.definition)
      updates.definition = editDefinition;

    if (Object.keys(updates).length > 0) {
      updateFlashcardMutation.mutate({
        flashcardId,
        flashcardSetId,
        ...updates,
      });
    } else {
      setEditingFlashcardId(null);
    }
  };

  const handleCancel = () => {
    setEditingFlashcardId(null);
  };

  const canEdit = userId === authorId;

  if (flashcards.length === 0) {
    return (
      <div>
        <Text as="h2">Flashcards (0)</Text>
        <Text className="mt-4 text-gray-500">No flashcards to display</Text>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="mb-2">
        <Text as="h2">Flashcards ({flashcards.length})</Text>
      </div>
      <div className="sticky top-22 z-10 mb-5 flex items-center justify-center gap-2 *:hover:bg-amber-500">
        <Button
          className="bg-purple-500 px-2 py-1 text-sm text-white"
          onClick={() => setHideTerm(!hideTerm)}
        >
          {hideTerm ? "Show Term" : "Hide Term"}
        </Button>
        <Button
          className="bg-pink-400 px-2 py-1 text-sm text-white"
          onClick={() => setHideDefinition(!hideDefinition)}
        >
          {hideDefinition ? "Show Definition" : "Hide Definition"}
        </Button>
      </div>

      <div className="space-y-4">
        {flashcards.map((flashcard, index) => {
          const isEditing = editingFlashcardId === flashcard.id;
          return (
            <Card
              key={flashcard.id}
              className={cn(
                "w-full transition-all hover:shadow-lg",
                currentIndex === index && "ring-4 ring-purple-400",
                !isEditing && "cursor-pointer",
              )}
              onClick={() => !isEditing && onCardClick?.(index)}
              onKeyDown={(e) => {
                if (isEditing) return;
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onCardClick?.(index);
                }
              }}
              tabIndex={isEditing ? -1 : 0}
              role="button"
              aria-label={`Select flashcard ${index + 1}: ${flashcard.term}`}
            >
              <div className="flex flex-col items-start gap-4 p-4 sm:flex-row">
                <Card
                  className={cn(
                    "flex h-10 w-10 items-center justify-center shadow-none",
                    currentIndex === index ? "bg-purple-400" : "bg-pink-300",
                  )}
                >
                  {index + 1}
                </Card>
                {/* For Term and Definition */}
                <div className="min-h-[200px] flex-1 space-y-4">
                  {isEditing ? (
                    <>
                      <div>
                        <Text className="mb-2 text-lg uppercase">Term</Text>
                        <Input
                          value={editTerm}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setEditTerm(e.target.value)
                          }
                          placeholder="Enter term"
                          className="text-xl"
                        />
                      </div>
                      <div className="max-w-full border-t" />
                      <div>
                        <Text className="mb-2 text-lg uppercase">
                          Definition
                        </Text>
                        <Textarea
                          value={editDefinition}
                          onChange={(
                            e: React.ChangeEvent<HTMLTextAreaElement>,
                          ) => setEditDefinition(e.target.value)}
                          placeholder="Enter definition"
                          className="text-xl"
                          rows={4}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSave(flashcard.id);
                          }}
                          className="bg-green-400 hover:bg-green-500"
                          size="sm"
                        >
                          <Check className="mr-2 size-4" strokeWidth={3} />
                          Save
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancel();
                          }}
                          className="bg-red-400 hover:bg-red-500"
                          size="sm"
                        >
                          <X className="mr-2 size-4" strokeWidth={3} />
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <Text className="mb-1 text-lg uppercase">Term</Text>
                        <Text
                          className={cn(
                            "text-2xl wrap-break-word transition",
                            hideTerm && "blur-sm",
                          )}
                        >
                          {flashcard.term}
                        </Text>
                      </div>
                      <div className="max-w-full border-t" />
                      <div>
                        <Text className="mb-1 text-lg uppercase">
                          Definition
                        </Text>
                        <Text
                          className={cn(
                            "text-2xl wrap-break-word transition",
                            hideDefinition && "blur-sm",
                          )}
                        >
                          {flashcard.definition}
                        </Text>
                      </div>
                    </>
                  )}
                </div>
                {canEdit && !isEditing && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(flashcard);
                    }}
                    className="flex h-10 w-10 items-center justify-center border-2 border-black bg-purple-300 hover:bg-purple-400"
                    aria-label="Edit flashcard"
                  >
                    <Pencil className="size-5" strokeWidth={3} />
                  </button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default FlashcardView;
