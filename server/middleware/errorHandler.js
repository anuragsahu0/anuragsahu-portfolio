/**
 * Centralized Express Error Handler
 * Returns consistent error schema: { success: false, error: { code, message } }
 * Never exposes stack traces in production.
 */
const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error('[API Error]', err.message);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    const msg = messages.join('. ');
    return res.status(422).json({
      success: false,
      message: msg,
      error: {
        code: 'VALIDATION_ERROR',
        message: msg,
      },
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'record';
    const msg = `A record with this ${field} already exists.`;
    return res.status(409).json({
      success: false,
      message: msg,
      error: {
        code: 'DUPLICATE_KEY',
        message: msg,
      },
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token.',
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid authentication token.',
      },
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Authentication token has expired.',
      error: {
        code: 'TOKEN_EXPIRED',
        message: 'Authentication token has expired.',
      },
    });
  }

  // Default server error
  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'An internal server error occurred.'
      : err.message || 'Internal Server Error';

  return res.status(statusCode).json({
    success: false,
    message,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message,
    },
  });
};

module.exports = errorHandler;
