import { customModel } from "@/lib/ai";
import { loadFileChunks } from "@/lib/ai/groq";
import { generateObject } from "ai";
import z from "zod";
import { zfd } from "zod-form-data";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { estimateTokens } from "@/lib/utils";
import { TRPCError } from "@trpc/server";

const aiRouter = createTRPCRouter({
  generateQuestionsFromPDF: protectedProcedure
    .input(
      zfd.formData({
        file: zfd.file(),
        numQuestions: zfd.numeric(),
        difficulty: zfd.text(),
      }),
    )
    .mutation(async ({ input }) => {
      const { file, numQuestions: numQuestionsRaw, difficulty } = input;
      const numQuestions = numQuestionsRaw ?? 5;
      if (!file) {
        throw new Error("No file provided");
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
        output: "array",
        prompt: `Generate ${numQuestions} ${difficulty} open-ended questions that test comprehension based on the following text:\n\n${textChunks.join("\n\n")}`,
        schema: z.object({
          question: z
            .string()
            .describe("An open-ended question based on the provided text"),
        }),
      });

      return { data };
    }),
});

export default aiRouter;
