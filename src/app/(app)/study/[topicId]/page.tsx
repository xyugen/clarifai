import { api } from "@/trpc/server";
import ActionCard from "./_components/action-card";
import Header from "./_components/header";
import QuestionCard from "./_components/question-card";
import QuestionsHeader from "./_components/questions-header";
import SummaryCard from "./_components/summary-card";

const Page = async ({ params }: { params: { topicId: string } }) => {
  const { topicId } = params;
  const { topic, questions } = await api.lesson.getLesson({ topicId: topicId });

  return (
    <div className="min-h-screen bg-cyan-100">
      <Header
        title={topic.title}
        author={topic.author}
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
                question={question.text}
              />
            ))}
          </div>
        </div>

        <ActionCard />
      </div>
    </div>
  );
};

export default Page;
