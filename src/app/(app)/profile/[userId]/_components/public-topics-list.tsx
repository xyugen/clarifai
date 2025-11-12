import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import { PageRoutes } from "@/constants/page-routes";
import { formatDate } from "date-fns";
import { ArrowRight, BookOpen, FileText } from "lucide-react";
import Link from "next/link";
import React from "react";

interface Topic {
  id: string;
  title: string;
  summary: string | null;
  visibility: string;
  createdAt: Date;
  questionCount: number;
}

interface PublicTopicsListProps {
  topics: Topic[];
  userName: string;
}

const PublicTopicsList: React.FC<PublicTopicsListProps> = ({
  topics,
  userName,
}: PublicTopicsListProps) => {
  if (topics.length === 0) {
    return (
      <div>
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
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Text as="h2" className="mb-4 text-2xl md:text-3xl">
          PUBLIC TOPICS
        </Text>
        <p className="text-gray-600">
          Explore {topics.length} public topic{topics.length !== 1 ? "s" : ""}{" "}
          shared by {userName}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => (
          <Link
            key={topic.id}
            href={`${PageRoutes.STUDY}/${topic.id}`}
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
  );
};

export default PublicTopicsList;
