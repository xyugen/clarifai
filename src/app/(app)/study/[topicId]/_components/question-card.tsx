import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import { PageRoutes } from "@/constants/page-routes";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/server";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

interface QuestionCardProps {
  index: number;
  topicId: string;
  questionId: string;
  question: string;
}

const QuestionCard: React.FC<QuestionCardProps> = async ({
  index,
  topicId,
  questionId,
  question,
}) => {
  const isAnswered = await api.lesson.isQuestionAnswered({
    questionId: questionId,
  });

  return (
    <Card className="group w-full cursor-pointer bg-white p-6 transition-all hover:-translate-y-1">
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex size-12 shrink-0 items-center justify-center border-2 border-black text-xl",
            isAnswered ? "bg-green-300" : "bg-primary",
          )}
        >
          {index}
        </div>
        <div className="flex-1">
          <Text as="p" className="mb-2 text-xl leading-tight font-black">
            {question}
          </Text>
          <div className="mt-4 flex items-center gap-2">
            <Link
              href={`${PageRoutes.STUDY}/${topicId}/${PageRoutes.QUESTION}/${index}`}
            >
              <Button
                className={cn(
                  "hover:bg-primary flex items-center gap-2 border-black px-4 py-2 font-sans font-bold transition-all hover:translate-x-0.5 hover:translate-y-0.5",
                  isAnswered ? "bg-green-300 hover:bg-green-400" : "",
                )}
              >
                {isAnswered ? "VIEW ANSWER" : "ANSWER NOW"}
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-1"
                  strokeWidth={3}
                />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default QuestionCard;
