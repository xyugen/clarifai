import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import { Lightbulb } from "lucide-react";

const TipCard = () => {
  return (
    <Card className="border-2 bg-purple-100 p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-black bg-purple-400">
          <Lightbulb className="h-5 w-5" strokeWidth={3} />
        </div>
        <div>
          <Text as="h4" className="text-sm` mb-1">
            WRITING TIP
          </Text>
          <Text as="p" className="text-sm text-gray-700">
            Focus on explaining the concept in your own words rather than
            memorizing definitions. The AI will give you personalized feedback!
          </Text>
        </div>
      </div>
    </Card>
  );
};

export default TipCard;
