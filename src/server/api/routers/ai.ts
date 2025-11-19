import {
  MAX_ANSWER_LENGTH,
  MIN_ANSWER_LENGTH,
} from "@/app/(app)/study/[topicId]/question/[questionIndex]/_components/schema";
import { customModel } from "@/lib/ai";
import { loadFileChunks } from "@/lib/ai/groq";
import {
  generateFeedbackPrompt,
  generateFlashcardPrompt,
  generateFlashcardUserPrompt,
  generateQuestionPrompt,
} from "@/lib/ai/prompts";
import {
  answerFeedbackSchema,
  flashcardSetSchema,
  lessonQuestionSchema,
} from "@/lib/api/object-schema";
import {
  getQuestionById,
  saveAnswer,
  saveFeedback,
  saveFlashcardSet,
  saveLesson,
} from "@/lib/db";
import {
  CachePrefix,
  deleteCached,
  deleteCachedByPattern,
} from "@/lib/redis/cache";
import { checkRateLimit, RateLimits } from "@/lib/redis/rate-limit";
import { estimateTokens } from "@/lib/utils";
import { TRPCError } from "@trpc/server";
import { generateObject } from "ai";
import z from "zod";
import { zfd } from "zod-form-data";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const aiRouter = createTRPCRouter({
  generateQuestionsFromPDF: protectedProcedure
    .input(
      zfd.formData({
        file: zfd.file(),
        numQuestions: zfd.numeric(),
        difficulty: zfd.text(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { file, numQuestions: numQuestionsRaw, difficulty } = input;
      const {
        session: { user },
      } = ctx;
      const numQuestions = numQuestionsRaw ?? 5;

      // Check rate limit for AI generation
      await checkRateLimit(user.id, "ai:generate", RateLimits.AI_GENERATION);

      if (!file) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No file provided",
        });
      }
      const textChunks = await loadFileChunks(file);

      const estimatedTokens = estimateTokens(textChunks.join(" "));

      if (estimatedTokens > 8000) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "The provided PDF contains too much text. Please upload a smaller file.",
        });
      }

      const data = await generateObject({
        model: customModel(),
        prompt: [
          {
            role: "system",
            content: generateQuestionPrompt(numQuestions, difficulty),
          },
          {
            role: "user",
            content: textChunks.join("\n\n"),
          },
        ],
        schema: lessonQuestionSchema,
      });

      const topicId = await saveLesson({
        title: data.object.title,
        summary: data.object.summary,
        questions: data.object.questions,
        authorId: user.id,
      });

      // Invalidate user's topic lists and stats cache after creating a new lesson
      await Promise.all([
        deleteCachedByPattern(`${CachePrefix.USER_TOPICS}${user.id}:*`),
        deleteCached(`${CachePrefix.USER_STATS}${user.id}`),
      ]);

      return { topicId };
    }),
  generateFeedbackFromAnswer: protectedProcedure
    .input(
      z.object({
        questionId: z.string(),
        userAnswer: z
          .string()
          .min(MIN_ANSWER_LENGTH, `Minimum ${MIN_ANSWER_LENGTH} characters`)
          .max(MAX_ANSWER_LENGTH, `Maximum ${MAX_ANSWER_LENGTH} characters`),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { questionId, userAnswer } = input;
      const {
        session: { user },
      } = ctx;

      if (!user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      // Check rate limit for AI generation
      await checkRateLimit(user.id, "ai:feedback", RateLimits.AI_GENERATION);

      const questionData = await getQuestionById(questionId);

      if (!questionData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Question not found",
        });
      }

      const { topic, question } = questionData;

      const data = await generateObject({
        model: customModel(),
        prompt: [
          {
            role: "system",
            content: generateFeedbackPrompt,
          },
          {
            role: "user",
            content: `TOPIC TITLE: ${topic.title}
          TOPIC SUMMARY: ${topic.summary}

          QUESTION: ${question.text}
          REFERENCE ANSWER: ${question.referenceAnswer}
          STUDENT ANSWER: ${userAnswer}

          Please analyze the student's answer in depth and generate thoughtful, constructive feedback as instructed.`,
          },
        ],
        schema: answerFeedbackSchema,
      });

      if (data.object.error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: data.object.error,
        });
      }

      const answerId = await saveAnswer({
        questionId: question.id,
        authorId: user.id,
        userAnswer,
      });

      if (!answerId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to save answer",
        });
      }

      const feedbackId = await saveFeedback(
        {
          id: crypto.randomUUID(),
          answerId,
          clarityScore: data.object.clarityScore,
          summary: data.object.summary,
          feedback: data.object.feedback,
          encouragement: data.object.encouragement,
        },
        data.object.keyPointsMissed,
        data.object.suggestions,
      );

      // Invalidate user stats cache after submitting an answer
      await deleteCached(`${CachePrefix.USER_STATS}${user.id}`);

      return { feedbackId };
    }),
  generateFlashcardsFromPDF: protectedProcedure
    .input(
      zfd.formData({
        file: zfd.file(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { file } = input;
      const {
        session: { user },
      } = ctx;

      // Check rate limit for AI generation
      await checkRateLimit(user.id, "ai:generate", RateLimits.AI_GENERATION);

      if (!file) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No file provided",
        });
      }

      const textChunks = await loadFileChunks(file);

      const estimatedTokens = estimateTokens(textChunks.join(" "));

      if (estimatedTokens > 8000) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "The provided PDF contains too much text. Please upload a smaller file.",
        });
      }

      const data = await generateObject({
        model: customModel(),
        prompt: [
          {
            role: "system",
            content: generateFlashcardPrompt,
          },
          {
            role: "user",
            content: generateFlashcardUserPrompt(textChunks.join("\n\n")),
          },
        ],
        schema: flashcardSetSchema,
      });

      const flashcardSetId = await saveFlashcardSet({
        title: data.object.title,
        summary: data.object.summary,
        flashcards: data.object.flashcards,
        authorId: user.id,
      });

      // Invalidate user's flashcard lists cache after creating a new flashcard set
      await deleteCachedByPattern(
        `${CachePrefix.USER_TOPICS}flashcard:${user.id}:*`,
      );

      return { flashcardSetId };
    }),
});
