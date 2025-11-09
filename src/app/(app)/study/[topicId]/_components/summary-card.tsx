import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import { FileText } from "lucide-react";
import React from "react";

interface SummaryCardProps {
  summary: string | null;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ summary }) => {
  return (
    <Card className="mb-8 border-2 bg-white p-6 md:p-8">
      <div className="space-y-4">
        <div className="flex w-full items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center border-2 border-black bg-blue-400">
            <FileText className="size-6" />
          </div>

          <Text as="h3" className="mb-3 text-2xl font-black">
            LESSON SUMMARY
          </Text>
        </div>
        <Text as="p" className="text-lg leading-relaxed text-gray-700">
          {summary}
        </Text>
      </div>
    </Card>
  );
};

export default SummaryCard;
