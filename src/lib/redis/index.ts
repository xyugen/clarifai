 
 
 
 
import { env } from "@/env";
import Redis from "ioredis";

let redis: Redis | null = null;

/**
 * Get Redis client instance. Returns null if Redis URL is not configured.
 * This allows the application to work without Redis (caching will be disabled).
 */
export function getRedisClient(): Redis | null {
  // If Redis URL is not configured, return null (caching disabled)
  if (!env.REDIS_URL) {
    return null;
  }

  // Create Redis client if it doesn't exist
  if (!redis) {
    try {
      const redisUrl = `redis://${env.REDIS_USERNAME}:${env.REDIS_PASSWORD}\@${env.REDIS_URL.replace(/^redis:\/\//, "")}`;
      redis = new Redis(encodeURI(redisUrl), {
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          if (times > 3) {
            return null; // Stop retrying after 3 attempts
          }
          return Math.min(times * 100, 2000); // Exponential backoff up to 2s
        },
        lazyConnect: true, // Don't connect immediately
      });

      // Handle connection events
      redis.on("error", (err) => {
        console.error("Redis connection error:", err);
      });

      redis.on("connect", () => {
        console.log("Redis connected successfully");
      });
    } catch (error) {
      console.error("Failed to create Redis client:", error);
      redis = null;
    }
  }

  return redis;
}

/**
 * Check if Redis is available and connected
 */
export async function isRedisAvailable(): Promise<boolean> {
  const client = getRedisClient();
  if (!client) return false;

  try {
    await client.ping();
    return true;
  } catch {
    return false;
  }
}

/**
 * Close Redis connection
 */
export async function closeRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
  }
}
