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

export const answerFeedbackSchema = z.object({
  clarityScore: z
    .number()
    .min(1)
    .max(100)
    .describe(
      "A numerical score from 1 to 100 (percentage) assessing the clarity and coherence of the student's answer.",
    ),
  summary: z
    .string()
    .describe(
      "A concise one-sentence summary of how well the student's answer aligns with the reference answer.",
    ),
  feedback: z.string().describe(
    "Detailed, constructive feedback evaluating the student's understanding. \
Should highlight strengths, point out specific areas for improvement, and guide the student toward deeper comprehension.",
  ),
  keyPointsMissed: z
    .array(z.string())
    .optional()
    .describe(
      "A list of important ideas or concepts from the reference answer that the student failed to mention.",
    ),
  suggestions: z
    .array(z.string())
    .optional()
    .describe(
      "Actionable advice or tips for improving the student's understanding or writing.",
    ),
  encouragement: z
    .string()
    .optional()
    .describe(
      "A motivational closing line that encourages continued learning or curiosity.",
    ),
  error: z
    .string()
    .optional()
    .describe(
      "An brief analysis note if the student's answer is inappropriate,. off-topic, or cannot be evaluated.",
    ),
});

export const flashcardSetSchema = z.object({
  title: z.string().describe("The title of the flashcard set"),
  summary: z
    .string()
    .describe("A brief summary of what the flashcard set covers"),
  flashcards: z
    .array(
      z.object({
        term: z.string().describe("The term or concept (short and specific)"),
        definition: z
          .string()
          .describe(
            "A concise definition or explanation (1-3 sentences, essential information only)",
          ),
      }),
    )
    .min(1)
    .describe("A list of flashcards with terms and definitions"),
});
