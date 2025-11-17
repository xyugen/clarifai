import { LESSON_ID_LENGTH } from "@/constants/lesson";
import { db } from "@/server/db";
import {
  answer as answerTable,
  feedback as feedbackTable,
  keyPointsMissed,
  question as questionTable,
  suggestions as suggestionsTable,
  topic as topicTable,
  user as userTable,
  type InsertFeedback,
} from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { and, avg, count, countDistinct, desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";

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
      id: nanoid(LESSON_ID_LENGTH),
      title,
      summary,
      authorId: authorId,
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
        id: nanoid(LESSON_ID_LENGTH),
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
      authorId: topicTable.authorId,
      author: userTable.name,
      summary: topicTable.summary,
      visibility: topicTable.visibility,
      createdAt: topicTable.createdAt,
    })
    .from(topicTable)
    .leftJoin(userTable, eq(userTable.id, topicTable.authorId))
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
      authorId: topicTable.authorId,
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

export const saveAnswer = async (answerData: {
  authorId: string;
  questionId: string;
  userAnswer: string;
  createdAt?: Date | undefined;
}) => {
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
      id: nanoid(LESSON_ID_LENGTH),
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
      id: nanoid(LESSON_ID_LENGTH),
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

export const getTopicsForUser = async (userId: string) => {
  // Get topics with their question counts in a single query using a subquery
  const topicsWithQuestionCounts = await db
    .select({
      id: topicTable.id,
      title: topicTable.title,
      lastActivity: topicTable.createdAt,
      totalQuestions: count(questionTable.id),
      answeredCount: countDistinct(answerTable.id),
    })
    .from(topicTable)
    .leftJoin(questionTable, eq(questionTable.topicId, topicTable.id))
    .leftJoin(
      answerTable,
      and(
        eq(answerTable.questionId, questionTable.id),
        eq(answerTable.authorId, userId),
      ),
    )
    .groupBy(topicTable.id)
    .where(eq(topicTable.authorId, userId))
    .execute();

  // Calculate progress for each topic
  const progressData = topicsWithQuestionCounts.map((session) => {
    const totalQuestions = Number(session.totalQuestions ?? 0);
    const answeredCount = Number(session.answeredCount ?? 0);
    const progress =
      totalQuestions > 0
        ? Math.round((answeredCount / totalQuestions) * 100)
        : 0;

    return {
      id: session.id,
      title: session.title,
      lastActivity: session.lastActivity,
      totalQuestions,
      answeredCount,
      progress,
    };
  });

  return progressData;
};

export const getTopicsForUserWithLimit = async (
  userId: string,
  limit: number,
) => {
  // Get topics with their question counts in a single query using a subquery
  const topicsWithQuestionCounts = await db
    .select({
      id: topicTable.id,
      title: topicTable.title,
      lastActivity: topicTable.createdAt,
      totalQuestions: count(questionTable.id),
      answeredCount: countDistinct(answerTable.id),
    })
    .from(topicTable)
    .leftJoin(questionTable, eq(questionTable.topicId, topicTable.id))
    .leftJoin(
      answerTable,
      and(
        eq(answerTable.questionId, questionTable.id),
        eq(answerTable.authorId, userId),
      ),
    )
    .groupBy(topicTable.id)
    .limit(limit)
    .where(eq(topicTable.authorId, userId))
    .execute();

  // Calculate progress for each topic
  const progressData = topicsWithQuestionCounts.map((session) => {
    const totalQuestions = Number(session.totalQuestions ?? 0);
    const answeredCount = Number(session.answeredCount ?? 0);

    const progress =
      totalQuestions > 0
        ? Math.round((answeredCount / totalQuestions) * 100)
        : 0;

    return {
      id: session.id,
      title: session.title,
      lastActivity: session.lastActivity,
      totalQuestions,
      answeredCount,
      progress,
    };
  });

  return progressData;
};

export const getUserStats = async (userId: string) => {
  // Combine session count and answered count into one query
  const [sessionsData] = await db
    .select({ sessions: countDistinct(topicTable.id) })
    .from(topicTable)
    .where(eq(topicTable.authorId, userId))
    .execute();

  const [answeredCountData] = await db
    .select({
      answeredCount: countDistinct(answerTable.questionId),
    })
    .from(answerTable)
    .where(eq(answerTable.authorId, userId))
    .execute();

  // Get answer dates for streak calculation and clarity in parallel
  const [answerDates, clarityData] = await Promise.all([
    db
      .select({
        date: answerTable.createdAt,
      })
      .from(answerTable)
      .where(eq(answerTable.authorId, userId))
      .groupBy(answerTable.createdAt)
      .orderBy(desc(answerTable.createdAt))
      .execute(),
    db
      .select({
        avgClarity: avg(feedbackTable.clarityScore),
      })
      .from(feedbackTable)
      .innerJoin(answerTable, eq(feedbackTable.answerId, answerTable.id))
      .where(eq(answerTable.authorId, userId))
      .execute(),
  ]);

  let streak = 0;
  if (answerDates.length > 0) {
    const today = new Date();
    let prevDate = new Date(today.toDateString());

    for (const row of answerDates) {
      const currentDate = new Date(row.date);
      const diffDays =
        (prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24);

      if (diffDays === 0) {
        continue;
      } else if (diffDays === 1) {
        streak++;
        prevDate = currentDate;
      } else {
        break;
      }
    }

    if (answerDates[0]?.date) {
      const firstDate = new Date(answerDates[0]?.date);
      if (firstDate.toDateString() === today.toDateString()) {
        streak++;
      }
    }
  }

  const clarity =
    clarityData[0]?.avgClarity !== null &&
    clarityData[0]?.avgClarity !== undefined
      ? Math.round(Number(clarityData[0].avgClarity))
      : 0;

  return {
    sessions: Number(sessionsData?.sessions ?? 0),
    answeredCount: Number(answeredCountData?.answeredCount ?? 0),
    streak,
    clarity,
  };
};

export const deleteTopicById = async (userId: string, topicId: string) => {
  try {
    const res = await db
      .delete(topicTable)
      .where(and(eq(topicTable.id, topicId), eq(topicTable.authorId, userId)));

    if (res.rowsAffected === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Topic not found or unauthorized",
      });
    }
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message:
        "Error deleting topic: " +
        (error instanceof Error ? error.message : String(error)),
    });
  }
};

export const getQuestionAnswers = async (
  userId: string,
  questionId: string,
) => {
  const [question] = await db
    .select()
    .from(questionTable)
    .where(eq(questionTable.id, questionId))
    .limit(1)
    .execute();

  if (!question) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Question not found",
    });
  }

  const answers = await db
    .select()
    .from(answerTable)
    .where(
      and(
        eq(answerTable.authorId, userId),
        eq(answerTable.questionId, questionId),
      ),
    )
    .execute();

  return answers;
};

export const updateTopicVisibility = async (
  topicId: string,
  visibility: "public" | "private",
) => {
  const res = await db
    .update(topicTable)
    .set({ visibility })
    .where(eq(topicTable.id, topicId));

  if (res.rowsAffected === 0) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Topic not found or unauthorized",
    });
  }
};

export const getAnswerWithFeedback = async (answerId: string) => {
  const [answerData] = await db
    .select()
    .from(answerTable)
    .where(eq(answerTable.id, answerId))
    .innerJoin(questionTable, eq(questionTable.id, answerTable.questionId))
    .limit(1)
    .execute();

  if (!answerData) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Answer not found",
    });
  }

  const feedbackData = await getFeedbackForAnswer(answerId);

  return {
    answerData,
    feedbackData,
  };
};
