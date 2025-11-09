import clsx from "clsx";
import { type ClassNameValue, twMerge } from "tailwind-merge";

export function cn(...classes: ClassNameValue[]) {
  return twMerge(clsx(classes));
}

/**
 * Rough LLM token calculator.
 * Based on the rule of thumb: ~1 token = 4 characters (average).
 * Adjust factors as needed for your target model.
 *
 * @param text - The input text to estimate tokens for.
 * @returns Estimated number of tokens.
 */
export function estimateTokens(text: string): number {
  const cleaned = text.trim();

  const wordCount = cleaned.split(/\s+/).filter(Boolean).length;

  const charCount = cleaned.length;

  const estimatedTokens = Math.round(
    (charCount / 4) * 0.6 + wordCount * 0.75 * 0.4,
  );

  return estimatedTokens;
}
