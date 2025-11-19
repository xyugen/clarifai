"use client";
import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import { cn } from "@/lib/utils";
import type { Flashcard } from "@/server/db/schema";
import { useState } from "react";

interface FlashcardViewProps {
  flashcards: Flashcard[];
  currentIndex: number;
  onCardClick?: (index: number) => void;
}

const FlashcardView: React.FC<FlashcardViewProps> = ({
  flashcards,
  currentIndex,
  onCardClick,
}) => {
  const [hideTerm, setHideTerm] = useState(false);
  const [hideDef, setHideDef] = useState(false);
  return (
    <div>
      <div className="mb-5">
        <Text as="h2">Flashcards ({flashcards.length})</Text>
      </div>
      <div className="mb-5 flex items-center justify-center gap-2 *:hover:bg-amber-500">
        <Button
          className="bg-purple-500 px-4 py-2 text-white"
          onClick={() => setHideTerm(!hideTerm)}
        >
          {hideTerm ? "Show Term" : "Hide Term"}
        </Button>
        <Button
          className="bg-pink-400 px-4 py-2 text-white"
          onClick={() => setHideDef(!hideDef)}
        >
          {hideDef ? "Show Definition" : "Hide Definition"}
        </Button>
      </div>

      <div className="space-y-4">
        {flashcards.map((flashcard, index) => (
          <Card
            key={flashcard.id}
            className={cn(
              "w-full cursor-pointer transition-all hover:shadow-lg",
              currentIndex === index && "ring-4 ring-purple-400",
            )}
            onClick={() => onCardClick?.(index)}
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
              {/*For Term and Definition */}
              <div className="min-h-[200px] flex-1 space-y-4">
                <div>
                  <Text className="mb-1 text-lg font-bold uppercase">Term</Text>
                  <Text
                    className={cn("text-2xl transition", hideTerm && "blur-sm")}
                  >
                    {flashcard.term}
                  </Text>
                </div>
                <div className="border-t" />
                <div className="space-y-4">
                  <Text className="mb-1 text-lg font-bold uppercase">
                    Definition
                  </Text>
                  <Text
                    className={cn("text-2xl transition", hideDef && "blur-sm")}
                  >
                    {flashcard.definition}
                  </Text>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FlashcardView;
