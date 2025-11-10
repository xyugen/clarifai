import {
  MAX_ANSWER_LENGTH,
  MIN_ANSWER_LENGTH,
} from "@/app/(app)/study/[topicId]/question/[questionIndex]/_components/schema";
import { customModel } from "@/lib/ai";
import { loadFileChunks } from "@/lib/ai/groq";
import { generateQuestionPrompt } from "@/lib/ai/prompts";
import {
  answerFeedbackSchema,
  lessonQuestionSchema,
} from "@/lib/api/object-schema";
import { getQuestionById, saveLesson } from "@/lib/db";
import { estimateTokens } from "@/lib/utils";
import { TRPCError } from "@trpc/server";
import { generateObject } from "ai";
import z from "zod";
import { zfd } from "zod-form-data";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const aiRouter = createTRPCRouter({
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
    .mutation(async ({ input }) => {
      const { questionId, userAnswer } = input;

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
            content: `You are an expert tutor providing constructive feedback on student answers. Review the student's answer in relation to the question and the reference answer provided. Offer specific suggestions for improvement, highlight strengths, and encourage further learning.`,
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

      return { feedback: data.object };
    }),
});

export default aiRouter;
