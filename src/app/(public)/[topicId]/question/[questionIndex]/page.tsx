import { PageRoutes } from "@/constants/page-routes";
import { getSession } from "@/server/better-auth/server";
import { api } from "@/trpc/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import FeedbackCard from "./_components/feedback-card";
import QuestionCard from "./_components/question-card";
import TipCard from "./_components/tip-card";
import TopNav from "./_components/top-nav";

type Props = {
  params: Promise<{ topicId: string; questionIndex: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topicId, questionIndex } = await params;
  const questionIndexInt = parseInt(questionIndex, 10);

  const questionData = await api.lesson.getQuestionByIndexPublic({
    topicId,
    questionIndex: questionIndexInt,
  });

  return {
    title: questionData.question.text,
  };
}

const Page = async ({ params }: Props) => {
  const { topicId, questionIndex } = await params;
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

  // Only fetch user-specific data if authenticated
  const session = await getSession();
  let isQuestionAnswered = false;
  let latestAnswer = null;
  let feedbackData = null;

  if (session?.user) {
    isQuestionAnswered = await api.lesson.isQuestionAnswered({
      questionId: questionData.question.id,
    });

    latestAnswer = isQuestionAnswered
      ? await api.lesson.getLatestAnswerFromUser({
          questionId: questionData.question.id,
        })
      : null;

    feedbackData =
      isQuestionAnswered && latestAnswer
        ? await api.lesson.getFeedbackForAnswer({
            answerId: latestAnswer.id,
          })
        : null;
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
          questionId={question.id}
          currentQuestionIndex={questionIndexInt}
          totalQuestions={totalQuestions}
          questionText={question.text}
          latestAnswer={latestAnswer}
        />

        {feedbackData && (
          <FeedbackCard
            feedback={feedbackData.feedback}
            keyPointsMissed={feedbackData.keyPointsMissed}
            suggestions={feedbackData.suggestions}
          />
        )}

        {!feedbackData && <TipCard />}
      </div>
    </div>
  );
};

export default Page;
