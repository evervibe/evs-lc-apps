/**
 * Rate limiter with Redis support and in-memory fallback
 * Uses Redis when REDIS_URL is configured, otherwise falls back to memory
 */

import Redis from 'ioredis';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store for fallback
const rateLimitStore = new Map<string, RateLimitEntry>();

// Redis client (lazy initialization)
let redisClient: Redis | null = null;
let redisEnabled = false;

// Initialize Redis if REDIS_URL is provided
function getRedisClient(): Redis | null {
  if (redisClient === null && process.env.REDIS_URL) {
    try {
      redisClient = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          if (times > 3) {
            console.warn('Redis connection failed, falling back to memory');
            redisEnabled = false;
            return null;
          }
          return Math.min(times * 50, 2000);
        },
      });
      
      redisClient.on('error', (err) => {
        console.error('Redis error:', err);
        redisEnabled = false;
      });
      
      redisClient.on('connect', () => {
        redisEnabled = true;
        console.log('Redis rate limiting enabled');
      });
    } catch (error) {
      console.error('Failed to initialize Redis:', error);
      redisEnabled = false;
      return null;
    }
  }
  return redisEnabled ? redisClient : null;
}

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

export const RATE_LIMIT_CONFIGS = {
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts per 15 minutes
  },
  gameLink: {
    windowMs: 10 * 60 * 1000, // 10 minutes
    maxRequests: 3, // 3 attempts per 10 minutes
  },
  default: {
    windowMs: 1 * 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute
  },
};

/**
 * Check if a request should be rate limited using Redis (with memory fallback)
 * Returns true if request should be allowed, false if rate limited
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = RATE_LIMIT_CONFIGS.default
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const redis = getRedisClient();
  
  if (redis && redisEnabled) {
    return checkRateLimitRedis(identifier, config, redis);
  }
  
  return checkRateLimitMemory(identifier, config);
}

/**
 * Redis-based rate limiting implementation
 */
async function checkRateLimitRedis(
  identifier: string,
  config: RateLimitConfig,
  redis: Redis
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const now = Date.now();
  const key = `ratelimit:${identifier}`;
  const windowSeconds = Math.ceil(config.windowMs / 1000);

  try {
    // Use Redis pipeline for atomic operations
    const pipeline = redis.pipeline();
    pipeline.incr(key);
    pipeline.ttl(key);
    
    const results = await pipeline.exec();
    
    if (!results || results.length !== 2) {
      throw new Error('Redis pipeline failed');
    }
    
    const count = results[0][1] as number;
    const ttl = results[1][1] as number;
    
    // Set expiry if this is the first request
    if (ttl === -1) {
      await redis.expire(key, windowSeconds);
    }
    
    const resetAt = now + (ttl > 0 ? ttl * 1000 : config.windowMs);
    const allowed = count <= config.maxRequests;
    const remaining = Math.max(0, config.maxRequests - count);
    
    return { allowed, remaining, resetAt };
  } catch (error) {
    console.error('Redis rate limit error, falling back to memory:', error);
    return checkRateLimitMemory(identifier, config);
  }
}

/**
 * Memory-based rate limiting implementation (fallback)
 */
function checkRateLimitMemory(
  identifier: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const key = identifier;

  // Get or create entry
  let entry = rateLimitStore.get(key);

  // Reset if window expired
  if (!entry || now > entry.resetAt) {
    entry = {
      count: 0,
      resetAt: now + config.windowMs,
    };
    rateLimitStore.set(key, entry);
  }

  // Increment count
  entry.count++;

  const allowed = entry.count <= config.maxRequests;
  const remaining = Math.max(0, config.maxRequests - entry.count);

  return {
    allowed,
    remaining,
    resetAt: entry.resetAt,
  };
}

/**
 * Cleanup expired entries (should be called periodically)
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}

// Cleanup every 5 minutes
setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
