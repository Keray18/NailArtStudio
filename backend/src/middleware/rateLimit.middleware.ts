import { Request, Response, NextFunction } from "express";
import { TooManyRequestsError } from "../utils/appError";
import { env } from "../config/env";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export interface RateLimitOptions {
  windowMs: number;
  max: number;
  message?: string;
  skipInTest?: boolean;
}

export function createRateLimiter(options: RateLimitOptions) {
  const store = new Map<string, RateLimitEntry>();
  const windowMs = options.windowMs;
  const max = options.max;
  const skipInTest = options.skipInTest ?? true;

  // Periodic cleanup of stale entries every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (now > entry.resetTime) {
        store.delete(key);
      }
    }
  }, 5 * 60 * 1000).unref(); // unref so it won't keep process alive in tests

  return (req: Request, res: Response, next: NextFunction): void => {
    // In test environment, allow skipping rate limiter unless explicitly enabled
    if (skipInTest && process.env.NODE_ENV === "test" && !process.env.TEST_RATE_LIMIT) {
      next();
      return;
    }

    const ip = req.ip || req.socket.remoteAddress || "unknown-ip";
    const now = Date.now();
    const entry = store.get(ip);

    if (!entry || now > entry.resetTime) {
      store.set(ip, {
        count: 1,
        resetTime: now + windowMs,
      });

      res.setHeader("X-RateLimit-Limit", max.toString());
      res.setHeader("X-RateLimit-Remaining", (max - 1).toString());
      res.setHeader("X-RateLimit-Reset", Math.ceil((now + windowMs) / 1000).toString());
      next();
      return;
    }

    entry.count += 1;
    const remaining = Math.max(0, max - entry.count);
    const resetSeconds = Math.ceil(entry.resetTime / 1000);

    res.setHeader("X-RateLimit-Limit", max.toString());
    res.setHeader("X-RateLimit-Remaining", remaining.toString());
    res.setHeader("X-RateLimit-Reset", resetSeconds.toString());

    if (entry.count > max) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      res.setHeader("Retry-After", retryAfter.toString());
      next(new TooManyRequestsError(options.message || "Too many requests. Please try again later."));
      return;
    }

    next();
  };
}

// Global rate limiter for standard browsing
export const globalRateLimiter = createRateLimiter({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  message: "Too many requests from this IP. Please wait before retrying.",
});

// Stricter rate limiter for sensitive operations (e.g., checkout submission, pincode checks)
export const sensitiveRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many sensitive operations requested from this IP. Please wait 15 minutes.",
});

