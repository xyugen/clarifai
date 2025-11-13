"use client";

import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import { PageRoutes } from "@/constants/page-routes";
import { formatDate } from "date-fns";
import { ArrowRight, CreditCard, Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

interface FlashcardSet {
  id: string;
  title: string;
  summary: string | null;
  visibility: string;
  createdAt: Date;
  flashcardCount: number;
}

interface FlashcardSetsListProps {
  flashcardSets: FlashcardSet[];
}

const FlashcardSetsList: React.FC<FlashcardSetsListProps> = ({
  flashcardSets,
}) => {
  if (flashcardSets.length === 0) {
    return (
      <div className="text-center">
        <Card className="border-foreground w-full bg-white p-8 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center border-2 border-black bg-gray-200">
            <CreditCard className="size-8 text-gray-500" />
          </div>
          <Text as="h2" className="mb-2 text-xl">
            No Flashcard Sets Yet
          </Text>
          <p className="mb-4 text-gray-600">
            Create your first flashcard set to get started.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Text className="text-lg text-gray-600">
          {flashcardSets.length} flashcard set
          {flashcardSets.length !== 1 ? "s" : ""}
        </Text>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {flashcardSets.map((set) => (
          <Link
            key={set.id}
            href={`${PageRoutes.FLASHCARDS}/${set.id}`}
            className="group block"
          >
            <Card className="h-full transition-shadow hover:shadow-lg">
              <div className="bg-white p-4">
                <div className="mb-3 flex items-start gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center border-2 border-black bg-purple-300">
                    <CreditCard className="size-6" />
                  </div>
                  <div className="flex-1">
                    <Text
                      as="h3"
                      className="decoration-primary mb-1 decoration-2 underline-offset-2 group-hover:underline"
                    >
                      {set.title}
                    </Text>
                    <p className="text-xs text-gray-600">
                      {set.flashcardCount} flashcard
                      {set.flashcardCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                {set.summary && (
                  <p className="mb-3 line-clamp-2 text-sm text-gray-700">
                    {set.summary}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    {formatDate(set.createdAt, "MMM dd, yyyy")}
                  </span>
                  <Button variant="default" size="sm">
                    STUDY
                    <ArrowRight className="ml-1 size-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FlashcardSetsList;
