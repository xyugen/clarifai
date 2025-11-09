import { db } from "@/server/db";
import {
  question as questionTable,
  topic as topicTable,
} from "@/server/db/schema";

export const saveLesson = async ({
  title,
  summary,
  questions,
  authorId,
}: {
  title: string;
  summary: string;
  questions: { question: string; answer: string }[];
  authorId: string;
}) => {
  const [topic] = await db
    .insert(topicTable)
    .values({
      id: crypto.randomUUID(),
      title,
      summary,
      author: authorId,
    })
    .returning({ id: topicTable.id })
    .execute();

  if (!topic) {
    throw new Error("Failed to create topic");
  }

  const [questionId] = await db
    .insert(questionTable)
    .values(
      questions.map((q) => ({
        id: crypto.randomUUID(),
        topicId: topic.id,
        text: q.question,
        referenceAnswer: q.answer,
      })),
    )
    .returning({ id: questionTable.id })
    .execute();

  if (!questionId) {
    throw new Error("Failed to create questions");
  }

  return topic.id;
};
