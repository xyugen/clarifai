import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import { PageRoutes } from "@/constants/page-routes";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

interface ActionCardProps {
  topicId: string;
}

const ActionCard: React.FC<ActionCardProps> = ({ topicId }) => {
  return (
    <Card className="w-full border-2 bg-purple-400 p-6 md:p-8">
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <Text as="h3" className="mb-2 text-2xl font-black">
            READY TO START?
          </Text>
          <Text as="p" className="text-lg">
            Answer all questions to test your understanding and get AI-powered
            feedback!
          </Text>
        </div>

        <Link href={`/${topicId}/question/1`}>
          <Button className="bg-primary hover:bg-primary flex items-center gap-2 border-black px-4 py-2 font-sans font-bold transition-all hover:translate-x-0.5 hover:translate-y-0.5">
            START LEARNING
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              strokeWidth={3}
            />
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default ActionCard;
