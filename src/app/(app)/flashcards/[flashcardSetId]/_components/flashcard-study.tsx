"use client";

import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { Menu } from "@/components/retroui/Menu";
import { Text } from "@/components/retroui/Text";
import { PageRoutes } from "@/constants/page-routes";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  RotateCw,
  Settings,
} from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import DeleteFlashcardSetButton from "./delete-flashcard-set-button";
import FlashcardPrivacyButton from "./flashcard-privacy-button";
import FlashcardView from "./flashcard-view";
import type { Flashcard, FlashcardSet } from "@/server/db/schema";



interface FlashcardStudyProps {
  userId: string;
  flashcardSet: FlashcardSet;
  flashcards: Flashcard[];
}

const FlashcardStudy = ({
  userId,
  flashcardSet,
  flashcards,
}: FlashcardStudyProps) => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showTermFirst, setShowTermFirst] = useState(true);

  const currentFlashcard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrevious();
    if (e.key === "ArrowRight") handleNext();
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleFlip();
    }
  };

  if (!currentFlashcard) {
    return (
      <Card className="border-2 bg-white p-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center border-2 border-black bg-purple-300">
          <CreditCard className="size-8" />
        </div>
        <Text as="p" className="text-xl text-gray-700">
          No flashcards available
        </Text>
      </Card>
    );
  }

  return (
    <div className="space-y-6" onKeyDown={handleKeyPress} tabIndex={0}>
      <Button
        variant="outline"
        size="sm"
        className="bg-background sm:hidden"
        onClick={() => router.push(PageRoutes.FLASHCARDS)}
      >
        <ArrowLeft className="mr-2 size-4" strokeWidth={3} />
        BACK
      </Button>
      {/* Compact Header */}
      <div className="border-2 border-black bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <div className="mb-4 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              className="bg-background hidden sm:inline-flex"
              onClick={() => router.push(PageRoutes.FLASHCARDS)}
            >
              <ArrowLeft className="mr-2 size-4" strokeWidth={3} />
              BACK
            </Button>

            <div className="flex items-start gap-2">
              <Menu>
                <Menu.Trigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-background flex h-8 items-center gap-2"
                  >
                    <Settings className="size-4" strokeWidth={3} />
                  </Button>
                </Menu.Trigger>
                <Menu.Content align="start" className="w-52">
                  <Menu.Item
                    onSelect={() => {
                      setShowTermFirst(true);
                      setIsFlipped(false);
                    }}
                  >
                    {showTermFirst && <Check className="mr-2 size-4" />}Show
                    Term First
                  </Menu.Item>
                  <Menu.Item
                    onSelect={() => {
                      setShowTermFirst(false);
                      setIsFlipped(false);
                    }}
                  >
                    {!showTermFirst && <Check className="mr-2 size-4" />}Show
                    Definition First
                  </Menu.Item>
                </Menu.Content>
              </Menu>

              {userId === flashcardSet.authorId && (
                <FlashcardPrivacyButton flashcardSetId={flashcardSet.id} />
              )}

              <DeleteFlashcardSetButton
                flashcardSetId={flashcardSet.id}
                redirectUrl={PageRoutes.FLASHCARDS}
                showLabel={false}
              />
            </div>
          </div>

          <div className="mb-4 space-y-2">
            <Text as="h1" className="text-2xl md:text-3xl">
              {flashcardSet.title}
            </Text>
            {flashcardSet.summary && (
              <Text as="p" className="text-gray-600">
                {flashcardSet.summary}
              </Text>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-2">
            <div className="mb-2 flex items-center justify-between">
              <Text as="p" className="text-xs text-gray-600 uppercase">
                Progress
              </Text>
              <Text as="p" className="text-sm">
                {currentIndex + 1} / {flashcards.length}
              </Text>
            </div>
            <div className="h-3 border-2 border-black bg-gray-200">
              <div
                className="h-full bg-purple-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Flashcard Area - HERO SECTION */}
      <div className="mx-auto max-w-5xl sm:px-4">
        <div
          className="perspective-1000 relative mx-auto w-full"
          style={{ height: "500px" }}
        >
          <div
            className={`transform-style-3d relative h-full w-full cursor-pointer transition-transform duration-500 ${
              isFlipped ? "rotate-y-180" : ""
            }`}
            onClick={handleFlip}
            role="button"
            aria-label={`Flashcard ${currentIndex + 1} of ${flashcards.length}. Click to flip. ${isFlipped ? "Showing back" : "Showing front"}`}
            tabIndex={0}
            style={{
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* Front of card - MAXIMUM EMPHASIS */}
            <Card
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-center bg-white p-4 backface-hidden hover:shadow-none md:p-12",
                !isFlipped ? "shadow-md" : "shadow-none",
              )}
              style={{
                backfaceVisibility: "hidden",
              }}
            >
              {/* Card Label */}
              <div className="absolute top-6 left-6">
                <div className="bg-primary -rotate-2 border-2 border-black px-3 py-1 text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  {showTermFirst ? "TERM" : "DEFINITION"}
                </div>
              </div>

              {/* Card Number */}
              <div className="absolute top-6 right-6">
                <div className="flex h-10 w-10 items-center justify-center border-2 border-black bg-pink-300 text-sm">
                  {currentIndex + 1}
                </div>
              </div>

              {/* Main Content */}
              <div className="flex w-full flex-1 items-center justify-center">
                <Text className="max-w-3xl text-center text-3xl leading-tight md:text-5xl">
                  {showTermFirst
                    ? currentFlashcard.term
                    : currentFlashcard.definition}
                </Text>
              </div>

              {/* Flip Hint */}
              <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 text-gray-400">
                <RotateCw className="size-5 animate-pulse" strokeWidth={2} />
                <Text className="text-sm">TAP TO FLIP</Text>
              </div>
            </Card>

            {/* Back of card - SECONDARY EMPHASIS */}
            <Card
              className="absolute inset-0 flex flex-col items-center justify-center bg-blue-300 p-4 shadow-md backface-hidden hover:shadow-none md:p-12"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              {/* Card Label */}
              <div className="absolute top-6 left-6">
                <div className="rotate-2 border-2 border-black bg-white px-3 py-1 text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  {showTermFirst ? "DEFINITION" : "TERM"}
                </div>
              </div>

              {/* Card Number */}
              <div className="absolute top-6 right-6">
                <div className="bg-primary flex h-10 w-10 items-center justify-center border-2 border-black text-sm">
                  {currentIndex + 1}
                </div>
              </div>

              {/* Main Content */}
              <div className="flex w-full flex-1 items-center justify-center">
                <Text className="max-w-3xl text-center text-2xl leading-relaxed md:text-4xl">
                  {showTermFirst
                    ? currentFlashcard.definition
                    : currentFlashcard.term}
                </Text>
              </div>

              {/* Flip Hint */}
              <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 text-gray-700">
                <RotateCw className="size-5 animate-pulse" strokeWidth={2} />
                <Text className="text-sm">TAP TO FLIP BACK</Text>
              </div>
            </Card>
          </div>
        </div>

        {/* Navigation Controls - TERTIARY EMPHASIS */}
        <div className="mt-8 flex flex-row items-center justify-between gap-4 *:h-10 *:w-fit!">
          <Button
            variant="outline"
            size="md"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="bg-background w-fit disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Previous flashcard"
          >
            <ArrowLeft className="size-5 sm:mr-2" strokeWidth={3} />
            <span className="hidden sm:block">PREV</span>
          </Button>

          <Button
            variant="default"
            size="md"
            onClick={handleFlip}
            className="w-fit border-2 bg-purple-300 hover:bg-purple-400"
            aria-label="Flip flashcard"
          >
            <RotateCw className="mr-2 size-5" strokeWidth={3} />
            FLIP
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={handleNext}
            disabled={currentIndex === flashcards.length - 1}
            className="bg-background disabled:cursor-not-allowed disabled:opacity-30 sm:w-full"
            aria-label="Next flashcard"
          >
            <span className="hidden sm:block">NEXT</span>
            <ArrowRight className="size-5 sm:ml-2" strokeWidth={3} />
          </Button>
        </div>

        {/* Keyboard Shortcuts Hint - MINIMAL EMPHASIS */}
        <div className="mt-6 text-center">
          <Text className="text-xs text-gray-500 font-bold">
            💡 TIP: Use arrow keys (← →) to navigate • Space/Enter to flip
          </Text>
        </div>
      </div>
      <div>
        <FlashcardView
          flashcards={flashcards}
          currentIndex={currentIndex}
          onCardClick={(index) => {
            setCurrentIndex(index);
            setIsFlipped(false);
                }
              }
            />
      </div>
    </div>
  );
};

export default FlashcardStudy;
