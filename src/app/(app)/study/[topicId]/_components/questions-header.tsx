import { Text } from "@/components/retroui/Text";
import { Brain } from "lucide-react";
import React from "react";

interface QuestionsHeaderProps {
  questionCount: number;
}

const QuestionsHeader: React.FC<QuestionsHeaderProps> = ({ questionCount }) => {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div className="flex size-12 rotate-3 items-center justify-center border-2 border-black bg-pink-400">
        <Brain className="size-6" />
      </div>
      <Text as="p" className="text-2xl md:text-3xl">
        QUESTIONS ({questionCount})
      </Text>
    </div>
  );
};

export default QuestionsHeader;
