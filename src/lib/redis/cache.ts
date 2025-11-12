import { getRedisClient } from "./index";

/**
 * Default TTL values for different types of cached data (in seconds)
 */
export const CacheTTL = {
  AI_RESPONSE: 3600, // 1 hour - AI-generated content
  LESSON: 1800, // 30 minutes - Lesson data
  USER_STATS: 600, // 10 minutes - User statistics
  QUESTION: 1800, // 30 minutes - Question data
  SHORT: 300, // 5 minutes - Short-lived data
} as const;

/**
 * Cache key prefixes for different data types
 */
export const CachePrefix = {
  AI_QUESTIONS: "ai:questions:",
  AI_FEEDBACK: "ai:feedback:",
  LESSON: "lesson:",
  USER_STATS: "user:stats:",
  QUESTION: "question:",
  USER_TOPICS: "user:topics:",
  RATE_LIMIT: "rate:limit:",
} as const;

/**
 * Get cached data by key
 */
export async function getCached<T>(key: string): Promise<T | null> {
  const redis = getRedisClient();
  if (!redis) return null;

  try {
    const data = await redis.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Error getting cached data for key ${key}:`, error);
    return null;
  }
}

/**
 * Set cached data with TTL
 */
export async function setCached(
  key: string,
  value: unknown,
  ttl: number = CacheTTL.SHORT,
): Promise<boolean> {
  const redis = getRedisClient();
  if (!redis) return false;

  try {
    await redis.setex(key, ttl, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting cached data for key ${key}:`, error);
    return false;
  }
}

/**
 * Delete cached data by key
 */
export async function deleteCached(key: string): Promise<boolean> {
  const redis = getRedisClient();
  if (!redis) return false;

  try {
    await redis.del(key);
    return true;
  } catch (error) {
    console.error(`Error deleting cached data for key ${key}:`, error);
    return false;
  }
}

/**
 * Delete multiple cached keys by pattern
 */
export async function deleteCachedByPattern(
  pattern: string,
): Promise<boolean> {
  const redis = getRedisClient();
  if (!redis) return false;

  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
    return true;
  } catch (error) {
    console.error(
      `Error deleting cached data for pattern ${pattern}:`,
      error,
    );
    return false;
  }
}

/**
 * Check if a key exists in cache
 */
export async function hasCached(key: string): Promise<boolean> {
  const redis = getRedisClient();
  if (!redis) return false;

  try {
    const exists = await redis.exists(key);
    return exists === 1;
  } catch (error) {
    console.error(`Error checking cached data for key ${key}:`, error);
    return false;
  }
}

/**
 * Increment a counter (useful for rate limiting)
 */
export async function incrementCounter(
  key: string,
  ttl = 60,
): Promise<number | null> {
  const redis = getRedisClient();
  if (!redis) return null;

  try {
    const count = await redis.incr(key);
    if (count === 1) {
      // First time, set expiry
      await redis.expire(key, ttl);
    }
    return count;
  } catch (error) {
    console.error(`Error incrementing counter for key ${key}:`, error);
    return null;
  }
}

/**
 * Get counter value
 */
export async function getCounter(key: string): Promise<number | null> {
  const redis = getRedisClient();
  if (!redis) return null;

  try {
    const value = await redis.get(key);
    return value ? parseInt(value, 10) : 0;
  } catch (error) {
    console.error(`Error getting counter for key ${key}:`, error);
    return null;
  }
}
