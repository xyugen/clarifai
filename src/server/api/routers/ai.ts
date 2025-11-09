import { customModel } from "@/lib/ai";
import { loadFileChunks } from "@/lib/ai/groq";
import { generateQuestionPrompt } from "@/lib/ai/prompts";
import { lessonQuestionSchema } from "@/lib/api/object-schema";
import { saveLesson } from "@/lib/db";
import { estimateTokens } from "@/lib/utils";
import { TRPCError } from "@trpc/server";
import { generateObject } from "ai";
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
            role: "assistant",
            content: `TEXT INPUT:${textChunks.join("\n\n")}`,
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
});

export default aiRouter;
