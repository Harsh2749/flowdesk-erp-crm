import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

/**
 * Global API rate limiter. Applied to all /api routes in app.ts.
 * Values are configurable via RATE_LIMIT_WINDOW_MS / RATE_LIMIT_MAX_REQUESTS.
 */
export const globalRateLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
});

/**
 * Stricter limiter reserved for sensitive auth endpoints (login, register)
 * to slow down brute-force attempts. Import and apply directly on the
 * auth routes in Phase 2.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again later.',
  },
});
