import DeleteTopicButton from "@/components/delete-topic-button";
import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { Progress } from "@/components/retroui/Progress";
import { Text } from "@/components/retroui/Text";
import { PageRoutes } from "@/constants/page-routes";
import { formatDate } from "date-fns";
import { ArrowRight, FileText } from "lucide-react";
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
  if (progress === 100) return "*:bg-green-300!";
  if (progress >= 50) return "*:bg-yellow-300!";
  return "*:bg-blue-300!";
};

export const TopicCard = memo(({ topic }: TopicCardProps) => {
  const completed = topic.answeredCount >= topic.totalQuestions;

  return (
    <Link href={`${PageRoutes.STUDY}/${topic.id}`} className="group block">
      <Card className="w-full divide-y-4 divide-black shadow-none hover:shadow-none">
        <div key={topic.id} className="bg-white p-4">
          <div className="mb-3 flex items-start gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center border-2 border-black bg-blue-300">
              <FileText className="size-6" />
            </div>
            <div className="flex-1">
              <Text
                as={"h3"}
                className="decoration-primary mb-1 decoration-2 underline-offset-2 group-hover:underline"
              >
                {topic.title}
              </Text>
              <p className="text-xs text-gray-600">
                {topic.answeredCount}/{topic.totalQuestions} answered
              </p>
            </div>
          </div>

          <div className="mb-3">
            <div className="mb-1 flex justify-between">
              <span className="text-xs">PROGRESS</span>
              <span className="text-xs">{topic.progress}%</span>
            </div>
            <Progress
              className={getProgressColor(topic.progress)}
              value={topic.progress}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">
              {formatDate(topic.lastActivity, "MMM dd, yyyy hh:mm a")}
            </span>
            <div className="flex items-center gap-2">
              <DeleteTopicButton topicId={topic.id} />
              <Link href={`${PageRoutes.STUDY}/${topic.id}`}>
                <Button variant={completed ? "outline" : "default"} size="sm">
                  {completed ? "REVIEW" : "RESUME"}
                  <ArrowRight className="ml-1 size-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
});

TopicCard.displayName = "TopicCard";
