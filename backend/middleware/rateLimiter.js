import rateLimit from 'express-rate-limit';

/**
 * General-purpose rate limiter for all API routes.
 * Limits each IP to 100 requests per 15-minute window.
 *
 * In production you'd move state to Redis so limits survive restarts
 * and work across multiple server replicas.
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: true, message: 'Too many requests, please try again later.' },
});

/**
 * Stricter limiter specifically for auth endpoints (login, register).
 * Brute-forcing passwords is the most obvious abuse vector, so we want
 * a tighter window here — 10 attempts per 15 minutes per IP.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: true, message: 'Too many login attempts, please try again in 15 minutes.' },
});
