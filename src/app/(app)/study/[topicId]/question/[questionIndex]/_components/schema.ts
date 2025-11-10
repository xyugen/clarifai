import z from "zod";

export const MIN_ANSWER_LENGTH = 6;
export const MAX_ANSWER_LENGTH = 1000;

export const formSchema = z.object({
  answer: z
    .string()
    .min(MIN_ANSWER_LENGTH, `Minimum ${MIN_ANSWER_LENGTH} characters`)
    .max(MAX_ANSWER_LENGTH, `Maximum ${MAX_ANSWER_LENGTH} characters`),
});
