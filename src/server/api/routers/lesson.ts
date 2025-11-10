import { getLesson, getQuestionByIndex } from "@/lib/db";
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
});
