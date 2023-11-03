import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis"

// Initiate Redis instance by connecting to REST URL
export const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || "",
    token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
  });
  
  // Create a new ratelimiter, that allows 10 requests per 10 seconds by default
  export const ratelimit = (
    requests: number = 10,
    seconds:
      | `${number} ms`
      | `${number} s`
      | `${number} m`
      | `${number} h`
      | `${number} d` = "10 s",
  ) => {
    return process.env.UPSTASH_REDIS_REST_URL &&
      process.env.UPSTASH_REDIS_REST_TOKEN
      ? new Ratelimit({
          redis: Redis.fromEnv(),
          limiter: Ratelimit.slidingWindow(requests, seconds),
          analytics: true,
        })
      : // if Redis is not configured, return a dummy ratelimiter
        // with the function limit() that always returns true
        {
          limit: () => ({
            success: true,
            limit: 10,
            remaining: 10,
            reset: 0,
            retryAfter: 0,
          }),
        };
  };