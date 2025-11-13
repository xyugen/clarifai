"use client";

import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import { PageRoutes } from "@/constants/page-routes";
import { ArrowLeft, ArrowRight, CreditCard, RotateCw, Settings } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import DeleteFlashcardSetButton from "./delete-flashcard-set-button";
import FlashcardPrivacyButton from "./flashcard-privacy-button";
import { Menu } from "@/components/retroui/Menu";

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
  const [showTermFirst, setShowTermFirst] = useState(true);

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
      {/* Header with title and controls */}
      <div className="rounded-lg border-4 border-black bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-start gap-4">
          <Card className="border-foreground bg-primary flex size-16 shrink-0 rotate-3 items-center justify-center border-2 hover:shadow-md">
            <CreditCard className="size-8" />
          </Card>
          <div className="flex-1">
            <div className="mb-3 flex items-center justify-between">
              <Card className="border-foreground inline-block -rotate-1 border-2 bg-purple-400 px-3 py-1 shadow hover:shadow">
                <span className="text-xs font-bold">FLASHCARD SET</span>
              </Card>

              <div className="flex items-center gap-2">
                <DeleteFlashcardSetButton
                  flashcardSetId={flashcardSet.id}
                  redirectUrl={PageRoutes.FLASHCARDS}
                  showLabel
                  className="h-10"
                />
              </div>
            </div>
            <Text
              as="h1"
              className="mb-3 text-3xl font-black leading-tight md:text-5xl"
            >
              {flashcardSet.title}
            </Text>
            {flashcardSet.summary && (
              <Text className="mb-3 text-gray-600">{flashcardSet.summary}</Text>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <FlashcardPrivacyButton flashcardSetId={flashcardSet.id} />
              <div className="text-sm text-gray-600">
                {currentIndex + 1} / {flashcards.length} cards
              </div>
              <Menu>
                <Menu.Trigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-background flex items-center gap-2"
                  >
                    <Settings className="size-4" />
                    <span>Settings</span>
                  </Button>
                </Menu.Trigger>
                <Menu.Content align="start" className="w-48">
                  <Menu.Item
                    onSelect={() => {
                      setShowTermFirst(true);
                      setIsFlipped(false);
                    }}
                  >
                    {showTermFirst ? "✓ " : ""}Show Term First
                  </Menu.Item>
                  <Menu.Item
                    onSelect={() => {
                      setShowTermFirst(false);
                      setIsFlipped(false);
                    }}
                  >
                    {!showTermFirst ? "✓ " : ""}Show Definition First
                  </Menu.Item>
                </Menu.Content>
              </Menu>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(PageRoutes.FLASHCARDS)}
          >
            <ArrowLeft className="mr-2 size-4" />
            Back to My Flashcards
          </Button>
        </div>
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
          {/* Front of card */}
          <Card
            className="backface-hidden absolute inset-0 flex items-center justify-center border-4 border-black bg-white p-8 shadow-xl hover:shadow-2xl"
            style={{
              backfaceVisibility: "hidden",
            }}
          >
            <div className="text-center">
              <Text className="mb-4 text-sm font-bold uppercase text-gray-500">
                {showTermFirst ? "Term" : "Definition"}
              </Text>
              <Text className="text-2xl font-black md:text-4xl">
                {showTermFirst
                  ? currentFlashcard.term
                  : currentFlashcard.definition}
              </Text>
              <div className="mt-8 flex items-center justify-center gap-2 text-gray-400">
                <RotateCw className="size-5" />
                <Text className="text-sm">Click to flip</Text>
              </div>
            </div>
          </Card>

          {/* Back of card */}
          <Card
            className="backface-hidden absolute inset-0 flex items-center justify-center border-4 border-black bg-blue-300 p-8 shadow-xl hover:shadow-2xl"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="text-center">
              <Text className="mb-4 text-sm font-bold uppercase text-gray-700">
                {showTermFirst ? "Definition" : "Term"}
              </Text>
              <Text className="text-lg font-medium leading-relaxed md:text-xl">
                {showTermFirst
                  ? currentFlashcard.definition
                  : currentFlashcard.term}
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
          className="bg-blue-500 hover:bg-blue-600"
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
