import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import { PageRoutes } from "@/constants/page-routes";
import { api } from "@/trpc/server";
import { Lightbulb, Send, Sparkles } from "lucide-react";
import { redirect } from "next/navigation";
import TopNav from "./_components/top-nav";
import QuestionCard from "./_components/question-card";

const Page = async ({
  params,
}: {
  params: { topicId: string; questionIndex: string };
}) => {
  const { topicId, questionIndex } = params;
  const questionIndexInt = parseInt(questionIndex, 10);

  if (Number.isNaN(questionIndexInt) || questionIndexInt < 0) {
    redirect(`${PageRoutes.STUDY}/${topicId}`);
  }

  const questionData = await api.lesson.getQuestionByIndex({
    topicId,
    questionIndex: questionIndexInt,
  });

  if (!questionData?.question) {
    redirect(`${PageRoutes.STUDY}/${topicId}`);
  }

  const { question, totalQuestions } = questionData;

  return (
    <div className="min-h-screen bg-cyan-100">
      <TopNav
        topicId={topicId}
        totalQuestions={totalQuestions}
        currentQuestionIndex={questionIndexInt}
      />

      <div className="mx-auto max-w-4xl px-4 py-8">
        <QuestionCard
          currentQuestionIndex={questionIndexInt}
          totalQuestions={totalQuestions}
          questionText={question.text}
        />

        {/* Tip Card */}
        <Card className="border-2 bg-purple-100 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center border-2 border-black bg-purple-400">
              <Lightbulb className="h-5 w-5" strokeWidth={3} />
            </div>
            <div>
              <Text as="h4" className="text-sm` mb-1">
                WRITING TIP
              </Text>
              <Text as="p" className="text-sm text-gray-700">
                Focus on explaining the concept in your own words rather than
                memorizing definitions. The AI will give you personalized
                feedback!
              </Text>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Page;
