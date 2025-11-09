"use client";

import { PageRoutes } from "@/constants/page-routes";
import { BookOpen, Brain, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import QuickActionCard from "./quick-action-card";

const QuickActionCards = () => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <QuickActionCard
        icon={Upload}
        badgeText="NEW"
        title="UPLOAD FILE"
        description="Start a new lesson with AI-generated questions"
        buttonText="UPLOAD PDF"
        bgColor="bg-pink-300"
        badgeColor="bg-pink-200"
        onClick={() => {
          router.push(PageRoutes.UPLOAD);
        }}
      />

      <QuickActionCard
        icon={Brain}
        badgeText="AI"
        title="FEYNMAN MODE"
        description="Explain concepts in your own words"
        buttonText="TRY NOW"
        bgColor="bg-blue-300"
        badgeColor="bg-blue-200"
        onClick={() => console.log("Feynman Mode clicked")}
      />

      <QuickActionCard
        icon={BookOpen}
        badgeText="LIBRARY"
        title="PAST LESSONS"
        description="Review and continue previous sessions"
        buttonText="VIEW ALL"
        bgColor="bg-green-300"
        badgeColor="bg-green-200"
        onClick={() => {
          console.log("View All clicked");
        }}
      />
    </div>
  );
};

export default QuickActionCards;
