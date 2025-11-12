import { TRPCError } from "@trpc/server";
import { CachePrefix, getCounter, incrementCounter } from "./cache";

export type RateLimitConfig = {
  windowSeconds: number; // Time window in seconds
  maxRequests: number; // Maximum requests allowed in the window
};

/**
 * Rate limiting configurations for different operations
 */
export const RateLimits = {
  AI_GENERATION: {
    windowSeconds: 3600, // 1 hour
    maxRequests: 20, // 20 AI generations per hour per user
  },
  API_GENERAL: {
    windowSeconds: 60, // 1 minute
    maxRequests: 60, // 60 requests per minute per user
  },
} as const;

/**
 * Check if rate limit is exceeded
 * @param userId User identifier
 * @param operation Operation type (e.g., 'ai:generate', 'api:general')
 * @param config Rate limit configuration
 * @returns true if rate limit is exceeded
 */
export async function isRateLimited(
  userId: string,
  operation: string,
  config: RateLimitConfig,
): Promise<boolean> {
  const key = `${CachePrefix.RATE_LIMIT}${operation}:${userId}`;
  const count = await incrementCounter(key, config.windowSeconds);

  // If Redis is not available, don't rate limit
  if (count === null) return false;

  return count > config.maxRequests;
}

/**
 * Get current rate limit count
 */
export async function getRateLimitCount(
  userId: string,
  operation: string,
): Promise<number> {
  const key = `${CachePrefix.RATE_LIMIT}${operation}:${userId}`;
  const count = await getCounter(key);
  return count ?? 0;
}

/**
 * Check rate limit and throw error if exceeded
 */
export async function checkRateLimit(
  userId: string,
  operation: string,
  config: RateLimitConfig,
): Promise<void> {
  const limited = await isRateLimited(userId, operation, config);

  if (limited) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: `Rate limit exceeded. Please try again later.`,
    });
  }
}
