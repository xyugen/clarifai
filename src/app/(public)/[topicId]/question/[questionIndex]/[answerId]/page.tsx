import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import { PageRoutes } from "@/constants/page-routes";
import { api } from "@/trpc/server";
import { formatDate } from "date-fns";
import { ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import FeedbackCard from "../_components/feedback-card";
import TopNav from "../_components/top-nav";

const Page = async ({
  params,
}: {
  params: Promise<{ topicId: string; questionIndex: string; answerId: string }>;
}) => {
  const { topicId, questionIndex, answerId } = await params;
  const questionIndexInt = parseInt(questionIndex, 10);

  if (Number.isNaN(questionIndexInt) || questionIndexInt < 0) {
    redirect(`/${topicId}`);
  }

  const questionData = await api.lesson.getQuestionByIndexPublic({
    topicId,
    questionIndex: questionIndexInt,
  });

  if (!questionData?.question) {
    redirect(`/${topicId}`);
  }

  const answerWithFeedback = await api.lesson.getAnswerWithFeedback({
    answerId,
  });

  if (!answerWithFeedback) {
    redirect(`/${topicId}/question/${questionIndex}`);
  }

  const { question, totalQuestions } = questionData;

  return (
    <div className="min-h-screen bg-cyan-100">
      <TopNav
        topicId={topicId}
        totalQuestions={totalQuestions}
        currentQuestionIndex={questionIndexInt}
      />

      <div className="mx-auto max-w-4xl px-4 py-6">
        {/* Back Button */}
        <Link
          href={`/${topicId}/question/${questionIndex}`}
          className="mb-6 inline-flex items-center gap-2 border-2 border-black bg-white px-4 py-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-50 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
        >
          <ArrowLeft className="size-4" />
          BACK TO QUESTION
        </Link>

        {/* Question Card - Read Only */}
        <Card className="mb-6 border-2 bg-white p-6 md:p-8">
          <div className="mb-6 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-black bg-pink-400 text-xl">
              {questionIndexInt}
            </div>
            <div className="flex-1">
              <div className="mb-3 inline-block border-2 border-black bg-blue-100 px-3 py-1 text-xs">
                QUESTION {questionIndexInt} OF {totalQuestions}
              </div>
              <Text as="h2" className="text-2xl leading-tight md:text-3xl">
                {question.text}
              </Text>
            </div>
          </div>

          {/* Answer Metadata */}
          <div className="mb-6 border-b-2 border-gray-200 pb-6">
            <div className="mb-4 inline-block border-2 border-black bg-purple-100 px-3 py-2">
              <div className="flex items-center gap-2 text-xs">
                <Calendar className="h-3.5 w-3.5" strokeWidth={3} />
                <span>
                  ANSWERED ON:{" "}
                  {formatDate(
                    answerWithFeedback.answerData.answer.createdAt,
                    "MMM dd, yyyy",
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Your Answer */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Text as="h4" className="text-sm uppercase">
                Your Answer
              </Text>
              <div className="flex-1 border-t-2 border-gray-300"></div>
            </div>
            <div className="rounded-none border-2 border-gray-300 bg-gray-50 p-4">
              <Text
                as="p"
                className="text-base leading-relaxed whitespace-pre-wrap text-gray-800"
              >
                {answerWithFeedback.answerData.answer.userAnswer}
              </Text>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {answerWithFeedback.answerData.answer.userAnswer.length}{" "}
              characters
            </div>
          </div>
        </Card>

        {/* Feedback Card */}
        {answerWithFeedback.feedbackData ? (
          <FeedbackCard
            feedback={answerWithFeedback.feedbackData.feedback}
            keyPointsMissed={answerWithFeedback.feedbackData.keyPointsMissed}
            suggestions={answerWithFeedback.feedbackData.suggestions}
          />
        ) : (
          <Card className="border-2 bg-orange-100 p-8 text-center">
            <Text as="p" className="text-lg text-gray-700">
              No feedback available for this answer yet.
            </Text>
          </Card>
        )}

        {/* Action Card */}
        <Card className="border-2 bg-blue-300 p-6">
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <Text as="h4" className="mb-2 text-xl">
                WANT TO TRY AGAIN?
              </Text>
              <Text as="p" className="text-gray-800">
                Review the feedback and submit a new answer to improve your
                understanding.
              </Text>
            </div>
            <Link
              href={`/${topicId}/question/${questionIndex}`}
              className="border-2 border-black bg-yellow-400 px-6 py-3 whitespace-nowrap shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-yellow-500 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
            >
              ANSWER AGAIN →
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Page;
