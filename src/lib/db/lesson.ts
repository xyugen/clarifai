import { db } from "@/server/db";
import {
  answer as answerTable,
  feedback as feedbackTable,
  keyPointsMissed,
  question as questionTable,
  suggestions as suggestionsTable,
  topic as topicTable,
  user as userTable,
  type InsertAnswer,
  type InsertFeedback,
} from "@/server/db/schema";
import { and, count, desc, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

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
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create topic",
    });
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
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create questions",
    });
  }

  return topic.id;
};

export const getLesson = async (lessonId: string) => {
  const [topic] = await db
    .select({
      id: topicTable.id,
      title: topicTable.title,
      authorId: topicTable.author,
      author: userTable.name,
      summary: topicTable.summary,
      visibility: topicTable.visibility,
      createdAt: topicTable.createdAt,
    })
    .from(topicTable)
    .leftJoin(userTable, eq(userTable.id, topicTable.author))
    .where(eq(topicTable.id, lessonId))
    .limit(1)
    .execute();

  if (!topic) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Lesson not found",
    });
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
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Lesson not found",
    });
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
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Question not found",
    });
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
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Question not found",
    });
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
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Question not found",
    });
  }

  return questionData;
};

export const saveAnswer = async (answerData: InsertAnswer) => {
  const [question] = await db
    .select()
    .from(questionTable)
    .where(eq(questionTable.id, answerData.questionId))
    .limit(1)
    .execute();

  if (!question) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Question not found",
    });
  }

  const [answer] = await db
    .insert(answerTable)
    .values({
      id: answerData.id,
      questionId: answerData.questionId,
      authorId: answerData.authorId,
      userAnswer: answerData.userAnswer,
    })
    .returning({ id: answerTable.id })
    .execute();

  if (!answer) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create answer",
    });
  }

  return answer.id;
};

export const saveFeedback = async (
  feedbackData: InsertFeedback,
  keyPointsMissedData?: string[],
  suggestionsData?: string[],
) => {
  const [answer] = await db
    .select()
    .from(answerTable)
    .where(eq(answerTable.id, feedbackData.answerId))
    .limit(1)
    .execute();

  if (!answer) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Answer not found",
    });
  }

  const [feedback] = await db
    .insert(feedbackTable)
    .values({
      id: crypto.randomUUID(),
      answerId: feedbackData.answerId,
      clarityScore: feedbackData.clarityScore,
      summary: feedbackData.summary,
      feedback: feedbackData.feedback,
      encouragement: feedbackData.encouragement,
    })
    .returning({ id: feedbackTable.id })
    .execute();

  if (!feedback) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create feedback",
    });
  }

  await db
    .insert(keyPointsMissed)
    .values(
      keyPointsMissedData?.map((point) => ({
        id: crypto.randomUUID(),
        feedbackId: feedback.id,
        point,
      })) ?? [],
    )
    .execute();

  await db
    .insert(suggestionsTable)
    .values(
      suggestionsData?.map((suggestion) => ({
        id: crypto.randomUUID(),
        feedbackId: feedback.id,
        suggestion,
      })) ?? [],
    )
    .execute();

  return feedback.id;
};

export const isQuestionAnsweredByUser = async (
  userId: string,
  questionId: string,
) => {
  const [answer] = await db
    .select()
    .from(answerTable)
    .where(
      and(
        eq(answerTable.questionId, questionId),
        eq(answerTable.authorId, userId),
      ),
    )
    .limit(1)
    .execute();

  return Boolean(answer);
};

export const getLatestAnswerFromUser = async (
  userId: string,
  questionId: string,
) => {
  const question = await getQuestionById(questionId);

  if (!question) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Question not found",
    });
  }

  const [answer] = await db
    .select()
    .from(answerTable)
    .where(
      and(
        eq(answerTable.authorId, userId),
        eq(answerTable.questionId, questionId),
      ),
    )
    .orderBy(desc(answerTable.createdAt))
    .limit(1)
    .execute();

  if (!answer) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Answer not found",
    });
  }

  return answer;
};

export const getFeedbackForAnswer = async (answerId: string) => {
  const [feedback] = await db
    .select()
    .from(feedbackTable)
    .where(eq(feedbackTable.answerId, answerId))
    .limit(1)
    .execute();

  if (!feedback) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Feedback not found",
    });
  }

  const keyPoints = await db
    .select()
    .from(keyPointsMissed)
    .where(eq(keyPointsMissed.feedbackId, feedback.id))
    .execute();

  const suggestions = await db
    .select()
    .from(suggestionsTable)
    .where(eq(suggestionsTable.feedbackId, feedback.id))
    .execute();

  return {
    feedback,
    keyPointsMissed: keyPoints,
    suggestions: suggestions,
  };
};
