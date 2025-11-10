import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import React from "react";
import QuestionForm from "./question-form";

interface QuestionCardProps {
  questionId: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  questionText: string;
}

interface QuestionCardHeaderProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  questionText: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  questionId,
  currentQuestionIndex,
  totalQuestions,
  questionText,
}) => {
  const isLastQuestion = currentQuestionIndex === totalQuestions;

  return (
    <Card className="bg-background mb-6 p-6 md:p-8">
      <QuestionCardHeader
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        questionText={questionText}
      />

      <QuestionForm
        questionId={questionId}
        currentQuestionIndex={currentQuestionIndex}
        isLastQuestion={isLastQuestion}
      />
    </Card>
  );
};

const QuestionCardHeader: React.FC<QuestionCardHeaderProps> = ({
  currentQuestionIndex,
  totalQuestions,
  questionText,
}) => {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex size-10 shrink-0 items-center justify-center border-2 border-black bg-pink-300 text-lg md:text-xl">
          {currentQuestionIndex}
        </div>
        <div className="border-2 border-black bg-blue-100 px-3 py-1 text-xs">
          QUESTION {currentQuestionIndex} OF {totalQuestions}
        </div>
      </div>
      <Text
        as="h2"
        className="font-sans text-lg! leading-tight text-pretty md:text-2xl!"
      >
        {questionText}
      </Text>
    </div>
  );
};

export default QuestionCard;
