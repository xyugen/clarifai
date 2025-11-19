"use client";

import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import { PageRoutes } from "@/constants/page-routes";
import { formatDate } from "date-fns";
import {
  ArrowRight,
  BookOpen,
  CreditCard,
  FileText,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

interface Topic {
  id: string;
  title: string;
  summary: string | null;
  visibility: string;
  createdAt: Date;
  questionCount: number;
}

interface FlashcardSet {
  id: string;
  title: string;
  summary: string | null;
  visibility: string;
  createdAt: Date;
  flashcardCount: number;
}

interface ProfileContentProps {
  userName: string;
  publicTopics: Topic[];
  publicFlashcardSets: FlashcardSet[];
}

const ProfileContent: React.FC<ProfileContentProps> = ({
  userName,
  publicTopics,
  publicFlashcardSets,
}) => {
  const [activeTab, setActiveTab] = useState<"topics" | "flashcards">("flashcards");

  return (
    <div>
      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b-2 border-black">
        <button
          onClick={() => setActiveTab("topics")}
          className={`px-6 py-3 text-lg font-bold transition-colors ${
            activeTab === "topics"
              ? "border-b-4 border-black bg-green-300"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          TOPICS ({publicTopics.length})
        </button>
        <button
          onClick={() => setActiveTab("flashcards")}
          className={`px-6 py-3 text-lg font-bold transition-colors ${
            activeTab === "flashcards"
              ? "border-b-4 border-black bg-purple-300"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          FLASHCARDS ({publicFlashcardSets.length})
        </button>
      </div>

      {/* Topics Tab Content */}
      {activeTab === "topics" && (
        <div>
          {publicTopics.length === 0 ? (
            <Card className="border-foreground w-full bg-white p-8 text-center">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center border-2 border-black bg-gray-200">
                <BookOpen className="size-8 text-gray-500" />
              </div>
              <Text as="h2" className="mb-2 text-xl">
                No Public Topics Yet
              </Text>
              <p className="text-gray-600">
                {userName} hasn&apos;t shared any public topics yet.
              </p>
            </Card>
          ) : (
            <div>
              <div className="mb-6">
                <Text as="h2" className="mb-4 text-2xl md:text-3xl">
                  PUBLIC TOPICS
                </Text>
                <p className="text-gray-600">
                  Explore {publicTopics.length} public topic
                  {publicTopics.length !== 1 ? "s" : ""} shared by {userName}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {publicTopics.map((topic) => (
                  <Link
                    key={topic.id}
                    href={`/${topic.id}`}
                    className="group block"
                  >
                    <Card className="h-full transition-shadow hover:shadow-lg">
                      <div className="bg-white p-4">
                        <div className="mb-3 flex items-start gap-3">
                          <div className="flex size-12 shrink-0 items-center justify-center border-2 border-black bg-green-300">
                            <FileText className="size-6" />
                          </div>
                          <div className="flex-1">
                            <Text
                              as="h3"
                              className="decoration-primary mb-1 decoration-2 underline-offset-2 group-hover:underline"
                            >
                              {topic.title}
                            </Text>
                            <p className="text-xs text-gray-600">
                              {topic.questionCount} question
                              {topic.questionCount !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>

                        {topic.summary && (
                          <p className="mb-3 line-clamp-2 text-sm text-gray-700">
                            {topic.summary}
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">
                            {formatDate(topic.createdAt, "MMM dd, yyyy")}
                          </span>
                          <Button variant="default" size="sm">
                            VIEW
                            <ArrowRight className="ml-1 size-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Flashcards Tab Content */}
      {activeTab === "flashcards" && (
        <div>
          {publicFlashcardSets.length === 0 ? (
            <Card className="border-foreground w-full bg-white p-8 text-center">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center border-2 border-black bg-gray-200">
                <CreditCard className="size-8 text-gray-500" />
              </div>
              <Text as="h2" className="mb-2 text-xl">
                No Public Flashcard Sets Yet
              </Text>
              <p className="text-gray-600">
                {userName} hasn&apos;t shared any public flashcard sets yet.
              </p>
            </Card>
          ) : (
            <div>
              <div className="mb-6">
                <Text as="h2" className="mb-4 text-2xl md:text-3xl">
                  PUBLIC FLASHCARD SETS
                </Text>
                <p className="text-gray-600">
                  Explore {publicFlashcardSets.length} public flashcard set
                  {publicFlashcardSets.length !== 1 ? "s" : ""} shared by{" "}
                  {userName}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {publicFlashcardSets.map((set) => (
                  <Link
                    key={set.id}
                    href={`/flashcards/${set.id}`}
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
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileContent;
