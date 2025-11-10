import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import { PageRoutes } from "@/constants/page-routes";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import Link from "next/link";
import { memo } from "react";

interface Topic {
  id: string;
  title: string;
  lastActivity: Date;
  totalQuestions: number;
  answeredCount: number;
  progress: number;
}

interface TopicCardProps {
  topic: Topic;
}

const getProgressColor = (progress: number) => {
  if (progress === 100) return "bg-green-400";
  if (progress >= 50) return "bg-yellow-400";
  return "bg-blue-400";
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const TopicCard = memo(({ topic }: TopicCardProps) => {
  return (
    <Link href={`${PageRoutes.STUDY}/${topic.id}`} className="block">
      <Card className="group w-full cursor-pointer border-2 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          {/* Topic Info */}
          <div className="min-w-0 flex-1">
            <Text
              as="h3"
              className="mb-2 truncate text-xl transition-colors group-hover:text-pink-600"
            >
              {topic.title}
            </Text>
            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="size-4 shrink-0" />
                <span>{formatDate(topic.lastActivity)}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="size-4 shrink-0" />
                <span>
                  {topic.answeredCount} / {topic.totalQuestions} answered
                </span>
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="shrink-0 space-y-2 md:w-64">
            <div className="flex items-center justify-between">
              <Text as="p" className="text-xs uppercase">
                Progress
              </Text>
              <Text as="p" className="text-lg">
                {topic.progress}%
              </Text>
            </div>
            <div className="h-4 border-2 border-black bg-gray-200">
              <div
                className={`h-full ${getProgressColor(topic.progress)} transition-all`}
                style={{ width: `${topic.progress}%` }}
              />
            </div>
            {topic.progress === 100 && (
              <div className="border-2 border-black bg-green-100 px-2 py-1 text-center text-xs font-black">
                ✓ COMPLETED
              </div>
            )}
          </div>

          {/* Action Button */}
          <button className="flex shrink-0 items-center gap-2 border-2 border-black bg-yellow-400 px-4 py-2 font-bold whitespace-nowrap shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-yellow-500 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
            {topic.progress === 100 ? "REVIEW" : "CONTINUE"}
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              strokeWidth={3}
            />
          </button>
        </div>
      </Card>
    </Link>
  );
});

TopicCard.displayName = "TopicCard";
