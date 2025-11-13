"use client";

import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import { PageRoutes } from "@/constants/page-routes";
import { ArrowLeft, ArrowRight, RotateCw } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";

type FlashcardSetType = {
  id: string;
  title: string;
  summary: string | null;
  authorId: string;
  author: string | null;
  visibility: string;
  createdAt: Date;
};

type FlashcardType = {
  id: string;
  flashcardSetId: string;
  term: string;
  definition: string;
};

interface FlashcardStudyProps {
  flashcardSet: FlashcardSetType;
  flashcards: FlashcardType[];
}

const FlashcardStudy = ({
  flashcardSet,
  flashcards,
}: FlashcardStudyProps) => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentFlashcard = flashcards[currentIndex];

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  if (!currentFlashcard) {
    return (
      <div className="text-center">
        <Text className="text-xl">No flashcards available</Text>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(PageRoutes.DASHBOARD)}
        >
          <ArrowLeft className="mr-2 size-4" />
          Back to Dashboard
        </Button>
        <div className="text-right">
          <Text className="text-sm text-gray-600">
            {currentIndex + 1} / {flashcards.length}
          </Text>
        </div>
      </div>

      {/* Title and Summary */}
      <div className="text-center">
        <h1 className="mb-2 text-3xl font-black md:text-4xl">
          {flashcardSet.title}
        </h1>
        {flashcardSet.summary && (
          <Text className="text-gray-600">{flashcardSet.summary}</Text>
        )}
      </div>

      {/* Flashcard */}
      <div className="perspective-1000 relative mx-auto h-96 w-full max-w-2xl">
        <div
          className={`relative h-full w-full cursor-pointer transition-transform duration-500 transform-style-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}
          onClick={handleFlip}
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front of card (Term) */}
          <Card
            className="backface-hidden absolute inset-0 flex items-center justify-center border-4 border-black bg-white p-8 shadow-xl"
            style={{
              backfaceVisibility: "hidden",
            }}
          >
            <div className="text-center">
              <Text className="mb-4 text-sm font-bold uppercase text-gray-500">
                Term
              </Text>
              <Text className="text-2xl font-black md:text-4xl">
                {currentFlashcard.term}
              </Text>
              <div className="mt-8 flex items-center justify-center gap-2 text-gray-400">
                <RotateCw className="size-5" />
                <Text className="text-sm">Click to flip</Text>
              </div>
            </div>
          </Card>

          {/* Back of card (Definition) */}
          <Card
            className="backface-hidden absolute inset-0 flex items-center justify-center border-4 border-black bg-purple-300 p-8 shadow-xl"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="text-center">
              <Text className="mb-4 text-sm font-bold uppercase text-gray-700">
                Definition
              </Text>
              <Text className="text-lg font-medium leading-relaxed md:text-xl">
                {currentFlashcard.definition}
              </Text>
              <div className="mt-8 flex items-center justify-center gap-2 text-gray-600">
                <RotateCw className="size-5" />
                <Text className="text-sm">Click to flip back</Text>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="md"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ArrowLeft className="mr-2 size-4" />
          Previous
        </Button>

        <Button
          variant="default"
          size="md"
          onClick={handleFlip}
          className="bg-purple-500 hover:bg-purple-600"
        >
          <RotateCw className="mr-2 size-4" />
          Flip Card
        </Button>

        <Button
          variant="outline"
          size="md"
          onClick={handleNext}
          disabled={currentIndex === flashcards.length - 1}
        >
          Next
          <ArrowRight className="ml-2 size-4" />
        </Button>
      </div>
    </div>
  );
};

export default FlashcardStudy;
