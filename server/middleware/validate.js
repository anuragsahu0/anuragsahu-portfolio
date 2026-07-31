const { validationResult } = require('express-validator');

/**
 * Validation Middleware
 * Runs express-validator checks and returns 400 if any fail.
 * Usage: add this as the last middleware in a route's validator chain.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

module.exports = { validate };
