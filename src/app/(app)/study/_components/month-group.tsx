import { Text } from "@/components/retroui/Text";
import { Calendar } from "lucide-react";
import { memo } from "react";
import { TopicCard } from "./topic-card";

interface Topic {
  id: string;
  title: string;
  lastActivity: Date;
  totalQuestions: number;
  answeredCount: number;
  progress: number;
}

interface MonthGroupProps {
  monthYear: string;
  topics: Topic[];
}

export const MonthGroup = memo(({ monthYear, topics }: MonthGroupProps) => {
  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center border-2 border-black bg-purple-400">
          <Calendar className="size-5" />
        </div>
        <Text as="h2" className="text-2xl uppercase">
          {monthYear}
        </Text>
        <div className="ml-4 flex-1 border-t-2 border-black"></div>
      </div>

      <div className="grid gap-4">
        {topics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
      </div>
    </div>
  );
});

MonthGroup.displayName = "MonthGroup";
