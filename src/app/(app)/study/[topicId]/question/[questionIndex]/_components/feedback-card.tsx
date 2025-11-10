import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import type { Feedback, KeyPointMissed, Suggestion } from "@/server/db/schema";
import {
  AlertCircle,
  Check,
  CheckCircle,
  ChevronRight,
  Sparkles,
  ThumbsUp,
  TrendingUp,
} from "lucide-react";
import type React from "react";

interface FeedbackCardProps {
  feedback: Feedback;
  keyPointsMissed: KeyPointMissed[] | [];
  suggestions: Suggestion[] | [];
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({
  feedback,
  keyPointsMissed,
  suggestions,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-300";
    if (score >= 60) return "bg-yellow-300";
    return "bg-orange-300";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "EXCELLENT";
    if (score >= 80) return "GOOD";
    if (score >= 60) return "FAIR";
    return "NEEDS WORK";
  };

  return (
    <Card className="mb-6 border-2 bg-white p-6 md:p-8">
      {/* Header */}
      <div className="mb-6 flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center border-2 border-black bg-green-300">
          <CheckCircle className="size-6" />
        </div>
        <div className="flex-1">
          <Text as="h3" className="text-2xl">
            AI FEEDBACK
          </Text>
          <Text as="p" className="text-gray-600">
            Here&lsquo;s your personalized analysis
          </Text>
        </div>
      </div>

      {/* Score Section */}
      <div className="mb-6">
        <div className="mb-3 flex items-center gap-4">
          <Text as="h4" className="text-sm uppercase">
            Clarity Score
          </Text>
          <Card
            className={`${getScoreColor(feedback.clarityScore)} px-3 py-1 shadow!`}
          >
            <span className="text-xs">
              {getScoreLabel(feedback.clarityScore)}
            </span>
          </Card>
        </div>

        <div className="flex w-full items-center gap-3">
          <div className="h-6 flex-1 border-2 border-black bg-gray-200">
            <div
              className={`${getScoreColor(feedback.clarityScore)} h-full transition-all duration-500`}
              style={{ width: `${feedback.clarityScore}%` }}
            />
          </div>
          <span className="text-3xl">{feedback.clarityScore}%</span>
        </div>
      </div>

      {/* Summary */}
      <Card className="mb-6 border-2 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 size-5 shrink-0" />
          <div>
            <Text as="h5" className="mb-2 text-sm uppercase">
              Quick Summary
            </Text>
            <Text as="p" className="text-sm leading-relaxed">
              {feedback.summary}
            </Text>
          </div>
        </div>
      </Card>

      {/* Detailed Feedback */}
      <div className="mb-6">
        <Text as="h4" className="mb-3 text-sm uppercase">
          Detailed Analysis
        </Text>
        <Text
          as="p"
          className="text-base leading-relaxed whitespace-pre-wrap text-gray-800"
        >
          {feedback.feedback}
        </Text>
      </div>

      {/* Key Points Missed */}
      {keyPointsMissed.length > 0 && (
        <Card className="mb-6 w-full border-2 bg-orange-50 p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-black bg-orange-300">
              <AlertCircle className="size-4" />
            </div>
            <Text as="h5" className="text-sm uppercase">
              Key Points to Cover
            </Text>
          </div>
          <ul className="space-y-2">
            {keyPointsMissed.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <ChevronRight className="mt-0.5 size-5 shrink-0 text-orange-500" />
                <span className="text-sm">{item.point}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <Card className="mb-6 w-full border-2 bg-purple-50 p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center border-2 border-black bg-purple-300">
              <TrendingUp className="size-4" />
            </div>
            <Text as="h5" className="text-sm uppercase">
              How to Improve
            </Text>
          </div>
          <ul className="space-y-2">
            {suggestions.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check className="mt-0.5 size-5 shrink-0 text-purple-500" />
                <span className="text-sm">{item.suggestion}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Encouragement */}
      {feedback.encouragement && (
        <Card className="w-full border-2 bg-yellow-100 p-4">
          <div className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center border-2 border-black bg-yellow-300">
              <ThumbsUp className="size-4" />
            </div>
            <Text as="p" className="text-sm leading-relaxed">
              {feedback.encouragement}
            </Text>
          </div>
        </Card>
      )}
    </Card>
  );
};

export default FeedbackCard;
