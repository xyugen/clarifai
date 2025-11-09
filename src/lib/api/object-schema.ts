import z from "zod";

export const lessonQuestionSchema = z.object({
  title: z.string().describe("The title of the lesson"),
  summary: z.string().describe("A brief summary of the lesson"),
  questions: z
    .array(
      z.object({
        question: z.string().describe("The open-ended question"),
        answer: z.string().describe("The reference answer to the question"),
      }),
    )
    .min(1)
    .max(10)
    .describe("A list of generated questions"),
});
