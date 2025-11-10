import { PageRoutes } from "@/constants/page-routes";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import FeedbackCard from "./_components/feedback-card";
import QuestionCard from "./_components/question-card";
import TipCard from "./_components/tip-card";
import TopNav from "./_components/top-nav";

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

  const isQuestionAnswered = await api.lesson.isQuestionAnswered({
    questionId: questionData.question.id,
  });

  const latestAnswer = isQuestionAnswered
    ? await api.lesson.getLatestAnswerFromUser({
        questionId: questionData.question.id,
      })
    : null;

  const feedbackData =
    isQuestionAnswered && latestAnswer
      ? await api.lesson.getFeedbackForAnswer({
          answerId: latestAnswer.id,
        })
      : null;

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
