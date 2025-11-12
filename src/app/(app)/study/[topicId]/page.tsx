import { api } from "@/trpc/server";
import type { Metadata } from "next";
import ActionCard from "./_components/action-card";
import Header from "./_components/header";
import QuestionCard from "./_components/question-card";
import QuestionsHeader from "./_components/questions-header";
import SummaryCard from "./_components/summary-card";

type Props = {
  params: Promise<{ topicId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const { topicId } = await params;

  const { topic } = await api.lesson.getLesson({ topicId: topicId });

  return {
    title: topic.title,
  };
}

const Page = async ({ params }: Props) => {
  const { topicId } = await params;
  const { topic, questions } = await api.lesson.getLesson({ topicId: topicId });

  return (
    <div className="min-h-screen bg-cyan-100">
      <Header
        topicId={topicId}
        title={topic.title}
        author={topic.author}
        authorId={topic.authorId}
        createdAt={topic.createdAt}
        questionCount={questions.length}
      />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <SummaryCard summary={topic.summary} />

        <div className="mb-6">
          <QuestionsHeader questionCount={questions.length} />

          <div className="space-y-4">
            {questions.map((question, index) => (
              <QuestionCard
                key={question.id}
                index={index + 1}
                topicId={topicId}
                questionId={question.id}
                question={question.text}
              />
            ))}
          </div>
        </div>

        <ActionCard topicId={topicId} />
      </div>
    </div>
  );
};

export default Page;
