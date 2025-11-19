"use client";

import { PageRoutes } from "@/constants/page-routes";
import { BookOpen, CreditCard, Upload } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import QuickActionCard from "./quick-action-card";

const QuickActionCards = () => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <QuickActionCard
        icon={Upload}
        badgeText="AI"
        title="GENERATE QUESTIONS"
        description="Upload a PDF and get AI-generated comprehension questions"
        buttonText="UPLOAD PDF"
        bgColor="bg-pink-300"
        badgeColor="bg-pink-200"
        onClick={() => {
          router.push(PageRoutes.UPLOAD);
        }}
      />

      <QuickActionCard
        icon={CreditCard}
        badgeText="AI"
        title="GENERATE FLASHCARDS"
        description="Turn PDF concepts into study flashcards with AI"
        buttonText="UPLOAD PDF"
        bgColor="bg-purple-300"
        badgeColor="bg-purple-200"
        onClick={() => {
          router.push(`${PageRoutes.FLASHCARDS}/upload`);
        }}
      />

      <QuickActionCard
        icon={BookOpen}
        badgeText="LIBRARY"
        title="MY TOPICS"
        description="Review and continue your active study topics"
        buttonText="VIEW ALL"
        bgColor="bg-green-300"
        badgeColor="bg-green-200"
        onClick={() => {
          router.push(PageRoutes.STUDY);
        }}
      />

      <QuickActionCard
        icon={CreditCard}
        badgeText="LIBRARY"
        title="MY FLASHCARDS"
        description="Study and review your flashcard sets"
        buttonText="VIEW ALL"
        bgColor="bg-blue-300"
        badgeColor="bg-blue-200"
        onClick={() => {
          router.push(PageRoutes.FLASHCARDS);
        }}
      />
    </div>
  );
};

export default QuickActionCards;
