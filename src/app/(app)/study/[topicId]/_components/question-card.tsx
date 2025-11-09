import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import { ArrowRight } from "lucide-react";
import React from "react";

interface QuestionCardProps {
  index: number;
  question: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ index, question }) => {
  return (
    <Card className="group cursor-pointer bg-white p-6 transition-all hover:-translate-y-1">
      <div className="flex items-start gap-4">
        <div className="bg-primary flex size-12 shrink-0 items-center justify-center border-2 border-black text-xl">
          {index}
        </div>
        <div className="flex-1">
          <Text as="p" className="mb-2 text-xl leading-tight font-black">
            {question}
          </Text>
          <div className="mt-4 flex items-center gap-2">
            <Button className="bg-primary hover:bg-primary flex items-center gap-2 border-black px-4 py-2 font-sans font-bold transition-all hover:translate-x-0.5 hover:translate-y-0.5">
              ANSWER NOW
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-1"
                strokeWidth={3}
              />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default QuestionCard;
