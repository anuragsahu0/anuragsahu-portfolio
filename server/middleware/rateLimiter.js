const rateLimit = require('express-rate-limit');

/**
 * Public API Rate Limiter
 * 100 requests per 15 minutes per IP.
 */
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again in 15 minutes.',
  },
});

/**
 * Auth Rate Limiter
 * 10 requests per 15 minutes per IP (stricter for login endpoint).
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many authentication attempts. Please try again in 15 minutes.',
    },
  },
});

/**
 * Contact Form Rate Limiter
 * 10 submissions per hour per IP.
 */
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many contact form submissions. Please wait before trying again.',
    },
    message: 'Too many contact form submissions. Please wait before trying again.',
  },
});

module.exports = { publicLimiter, authLimiter, contactLimiter };
