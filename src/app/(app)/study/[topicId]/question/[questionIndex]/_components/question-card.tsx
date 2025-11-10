import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import { Send, Sparkles } from "lucide-react";
import * as React from "react";

interface QuestionCardProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  questionText: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  currentQuestionIndex,
  totalQuestions,
  questionText,
}) => {
  return (
    <Card className="bg-background mb-6 p-6 md:p-8">
      <QuestionCardHeader
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        questionText={questionText}
      />

      {/* Answer Input */}
      <div className="mb-6">
        <label className="mb-3 flex items-center gap-2 text-sm uppercase">
          <Sparkles className="size-4" />
          Your Answer
        </label>
        <textarea
          placeholder="Take your time to think through your answer..."
          className="h-64 w-full resize-none border-2 border-black p-4 text-lg font-medium focus:ring-4 focus:ring-yellow-400 focus:outline-none"
        />
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm text-gray-600">0 / 500 characters</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          variant={"default"}
          className="flex flex-1 items-center justify-center gap-2"
        >
          <Send className="size-5" strokeWidth={3} />
          SUBMIT ANSWER
        </Button>
        <Button variant={"outline"}>SKIP FOR NOW</Button>
      </div>
    </Card>
  );
};

const QuestionCardHeader: React.FC<QuestionCardProps> = ({
  currentQuestionIndex,
  totalQuestions,
  questionText,
}) => {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex size-10 shrink-0 items-center justify-center border-2 border-black bg-pink-300 text-lg md:size-12 md:text-xl">
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
