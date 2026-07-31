/**
 * Centralized Express Error Handler
 * Must be registered as the LAST middleware in index.js.
 * Never exposes stack traces in production.
 */
const errorHandler = (err, req, res, next) => {
  console.error('[ERROR]', err.message);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: messages.join('. ') });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `A record with this ${field} already exists.`,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token has expired.' });
  }

  // Default server error
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message:
      process.env.NODE_ENV === 'production'
        ? 'An internal server error occurred.'
        : err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
