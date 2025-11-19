import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import { getSession } from "@/server/better-auth/server";
import type { Answer } from "@/server/db/schema";
import React from "react";
import HistoryButton from "./history-button";
import QuestionForm from "./question-form";
import LoginPrompt from "./login-prompt";

interface QuestionCardProps {
  questionId: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  questionText: string;
  latestAnswer?: Answer | null;
  isAuthenticated: boolean;
}

interface QuestionCardHeaderProps {
  questionId: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  questionText: string;
  isAuthenticated: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  questionId,
  currentQuestionIndex,
  totalQuestions,
  questionText,
  latestAnswer,
  isAuthenticated,
}) => {
  const isLastQuestion = currentQuestionIndex === totalQuestions;

  return (
    <Card className="bg-background mb-6 p-6 md:p-8">
      <QuestionCardHeader
        questionId={questionId}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        questionText={questionText}
        isAuthenticated={isAuthenticated}
      />

      {isAuthenticated ? (
        <QuestionForm
          questionId={questionId}
          currentQuestionIndex={currentQuestionIndex}
          isLastQuestion={isLastQuestion}
          latestAnswer={latestAnswer?.userAnswer}
        />
      ) : (
        <LoginPrompt />
      )}
    </Card>
  );
};

const QuestionCardHeader: React.FC<QuestionCardHeaderProps> = ({
  questionId,
  currentQuestionIndex,
  totalQuestions,
  questionText,
  isAuthenticated,
}) => {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-10 shrink-0 items-center justify-center border-2 border-black bg-pink-300 text-lg md:text-xl">
            {currentQuestionIndex}
          </div>
          <div className="border-2 border-black bg-blue-100 px-3 py-1 text-xs">
            QUESTION {currentQuestionIndex} OF {totalQuestions}
          </div>
        </div>
        {isAuthenticated && <HistoryButton questionId={questionId} questionText={questionText} />}
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
