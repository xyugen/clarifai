import { db } from "@/server/db";
import {
  question as questionTable,
  topic as topicTable,
  user,
} from "@/server/db/schema";
import { eq } from "drizzle-orm";

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

export const getLesson = async (lessonId: string) => {
  const [topic] = await db
    .select({
      id: topicTable.id,
      title: topicTable.title,
      author: user.name,
      summary: topicTable.summary,
      createdAt: topicTable.createdAt,
    })
    .from(topicTable)
    .leftJoin(user, eq(user.id, topicTable.author))
    .where(eq(topicTable.id, lessonId))
    .limit(1)
    .execute();

  if (!topic) {
    throw new Error("Lesson not found");
  }

  const questions = await db
    .select()
    .from(questionTable)
    .where(eq(questionTable.topicId, topic.id))
    .execute();

  return {
    topic,
    questions,
  };
};
