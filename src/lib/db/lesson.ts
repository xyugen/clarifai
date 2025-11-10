import { db } from "@/server/db";
import {
  question as questionTable,
  topic as topicTable,
  user,
} from "@/server/db/schema";
import { count, eq } from "drizzle-orm";

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
      authorId: topicTable.author,
      author: user.name,
      summary: topicTable.summary,
      visibility: topicTable.visibility,
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

export const getQuestionByIndex = async (
  topicId: string,
  questionIndex: number,
) => {
  // Verify the topic exists
  const [topic] = await db
    .select({
      id: topicTable.id,
      authorId: topicTable.author,
      visibility: topicTable.visibility,
    })
    .from(topicTable)
    .where(eq(topicTable.id, topicId))
    .limit(1)
    .execute();

  if (!topic) {
    throw new Error("Lesson not found");
  }

  // Get total number of questions
  const totalResult = await db
    .select({ totalQuestions: count(questionTable.id) })
    .from(questionTable)
    .where(eq(questionTable.topicId, topicId))
    .execute();

  const totalQuestions = Number(totalResult?.[0]?.totalQuestions ?? 0);

  // Validate requested index
  if (questionIndex < 1 || questionIndex > totalQuestions) {
    throw new Error("Question not found");
  }

  // Get only the Nth question using offset
  const [question] = await db
    .select()
    .from(questionTable)
    .where(eq(questionTable.topicId, topicId))
    .limit(1)
    .offset(questionIndex - 1)
    .execute();

  if (!question) {
    throw new Error("Question not found");
  }

  return { topic, question, totalQuestions };
};

export const getQuestionById = async (questionid: string) => {
  const [questionData] = await db
    .select()
    .from(questionTable)
    .where(eq(questionTable.id, questionid))
    .innerJoin(topicTable, eq(topicTable.id, questionTable.topicId))
    .limit(1)
    .execute();

  if (!questionData) {
    throw new Error("Question not found");
  }

  return questionData;
};
