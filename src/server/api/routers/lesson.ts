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

      const { topic, questions } = await getLesson(topicId);

      if (topic.authorId !== user.id && topic.visibility === "private") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized access to lesson",
        });
      }

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

    const topics = await getTopicsForUser(user.id);

    if (!topics) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Topics not found",
      });
    }

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

    const stats = await getUserStats(user.id);

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
