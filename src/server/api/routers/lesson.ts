import {
  deleteTopicById,
  getAnswerWithFeedback,
  getFeedbackForAnswer,
  getLatestAnswerFromUser,
  getLesson,
  getQuestionAnswers as getQuestionAnswersFromUser,
  getQuestionByIndex,
  getTopicsForUser,
  getTopicsForUserWithLimit,
  getUserStats,
  isQuestionAnsweredByUser,
  updateTopicVisibility,
} from "@/lib/db";
import {
  CachePrefix,
  CacheTTL,
  deleteCached,
  deleteCachedByPattern,
  getCached,
  setCached,
} from "@/lib/redis/cache";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const lessonRouter = createTRPCRouter({
  getLesson: protectedProcedure
    .input(
      z.object({
        topicId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { topicId } = input;
      const {
        session: { user },
      } = ctx;

      // Try to get from cache first
      const cacheKey = `${CachePrefix.LESSON}${topicId}`;
      const cached = await getCached<{
        topic: Awaited<ReturnType<typeof getLesson>>["topic"];
        questions: Awaited<ReturnType<typeof getLesson>>["questions"];
      }>(cacheKey);

      if (cached) {
        // Check authorization for cached data
        if (
          cached.topic.authorId !== user.id &&
          cached.topic.visibility === "private"
        ) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Unauthorized access to lesson",
          });
        }
        return cached;
      }

      // If not in cache, fetch from database
      const { topic, questions } = await getLesson(topicId);

      if (topic.authorId !== user.id && topic.visibility === "private") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized access to lesson",
        });
      }

      // Cache the result
      await setCached(cacheKey, { topic, questions }, CacheTTL.LESSON);

      return { topic, questions };
    }),
  getQuestionByIndex: protectedProcedure
    .input(
      z.object({
        topicId: z.string(),
        questionIndex: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { topicId, questionIndex } = input;
      const {
        session: { user },
      } = ctx;

      const { topic, question, totalQuestions } = await getQuestionByIndex(
        topicId,
        questionIndex,
      );

      if (topic.authorId !== user.id && topic.visibility === "private") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized access to lesson",
        });
      }

      if (!question) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Question not found",
        });
      }

      return { question, totalQuestions };
    }),
  isQuestionAnswered: protectedProcedure
    .input(
      z.object({
        questionId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { questionId } = input;
      const {
        session: { user },
      } = ctx;

      if (!user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      const isAnswered = await isQuestionAnsweredByUser(user.id, questionId);

      return isAnswered;
    }),
  getLatestAnswerFromUser: protectedProcedure
    .input(
      z.object({
        questionId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { questionId } = input;
      const {
        session: { user },
      } = ctx;

      if (!user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      const latestAnswer = await getLatestAnswerFromUser(user.id, questionId);

      return latestAnswer;
    }),
  getFeedbackForAnswer: protectedProcedure
    .input(
      z.object({
        answerId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { answerId } = input;
      const {
        session: { user },
      } = ctx;

      if (!user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      const feedbackData = await getFeedbackForAnswer(answerId);

      if (!feedbackData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Feedback not found",
        });
      }

      return feedbackData;
    }),
  getTopicsForUser: protectedProcedure.query(async ({ ctx }) => {
    const {
      session: { user },
    } = ctx;

    if (!user.id) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    // Try to get from cache first
    const cacheKey = `${CachePrefix.USER_TOPICS}${user.id}:all`;
    const cached =
      await getCached<Awaited<ReturnType<typeof getTopicsForUser>>>(cacheKey);

    if (cached) {
      return cached;
    }

    // If not in cache, fetch from database
    const topics = await getTopicsForUser(user.id);

    if (!topics) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Topics not found",
      });
    }

    // Cache the result
    await setCached(cacheKey, topics, CacheTTL.LESSON);

    return topics;
  }),
  getTopicsForUserWithLimit: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(6),
      }),
    )
    .query(async ({ input, ctx }) => {
      const {
        session: { user },
      } = ctx;

      if (!user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      const topics = await getTopicsForUserWithLimit(user.id, input.limit);

      if (!topics) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Topics not found",
        });
      }

      return topics;
    }),
  getUserStats: protectedProcedure.query(async ({ ctx }) => {
    const {
      session: { user },
    } = ctx;

    if (!user.id) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    // Try to get from cache first
    const cacheKey = `${CachePrefix.USER_STATS}${user.id}`;
    const cached =
      await getCached<Awaited<ReturnType<typeof getUserStats>>>(cacheKey);

    if (cached) {
      return cached;
    }

    // If not in cache, fetch from database
    const stats = await getUserStats(user.id);

    // Cache the result
    await setCached(cacheKey, stats, CacheTTL.USER_STATS);

    return stats;
  }),
  deleteTopic: protectedProcedure
    .input(
      z.object({
        topicId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { topicId } = input;
      const {
        session: { user },
      } = ctx;

      await deleteTopicById(user.id, topicId);

      // Invalidate related caches
      await Promise.all([
        deleteCached(`${CachePrefix.LESSON}${topicId}`),
        deleteCachedByPattern(`${CachePrefix.USER_TOPICS}${user.id}:*`),
        deleteCached(`${CachePrefix.USER_STATS}${user.id}`),
      ]);
    }),
  getQuestionAnswersFromUser: protectedProcedure
    .input(
      z.object({
        questionId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { questionId } = input;
      const {
        session: { user },
      } = ctx;

      const answers = await getQuestionAnswersFromUser(user.id, questionId);

      return answers;
    }),
  getTopicVisibility: protectedProcedure
    .input(
      z.object({
        topicId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { topicId } = input;
      const {
        session: { user },
      } = ctx;

      const { topic } = await getLesson(topicId);

      if (topic.authorId !== user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized access to lesson",
        });
      }

      return topic.visibility;
    }),
  updateTopicVisibility: protectedProcedure
    .input(
      z.object({
        topicId: z.string(),
        visibility: z.enum(["public", "private"]),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { topicId, visibility } = input;
      const {
        session: { user },
      } = ctx;

      const { topic } = await getLesson(topicId);

      if (topic.authorId !== user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized access to lesson",
        });
      }

      await updateTopicVisibility(topicId, visibility);

      // Invalidate related caches
      await Promise.all([
        deleteCached(`${CachePrefix.LESSON}${topicId}`),
        deleteCachedByPattern(`${CachePrefix.USER_TOPICS}${user.id}:*`),
      ]);
    }),
  getAnswerWithFeedback: protectedProcedure
    .input(
      z.object({
        answerId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { answerId } = input;
      const {
        session: { user },
      } = ctx;

      if (!user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      const answerData = await getAnswerWithFeedback(answerId);

      if (!answerData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Answer not found",
        });
      }

      return answerData;
    }),
});
