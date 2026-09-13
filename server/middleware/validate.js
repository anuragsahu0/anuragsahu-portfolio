const { body, validationResult } = require('express-validator');
const { sendError } = require('../utils/apiResponse');

/**
 * Login input validation rules
 */
const loginRules = [
  body('email')
    .customSanitizer((val, { req }) => {
      const candidate = val || req.body.username || req.body.id || '';
      return typeof candidate === 'string' ? candidate.trim() : '';
    })
    .notEmpty()
    .withMessage('Administrator ID or email is required.')
    .custom((val) => {
      const v = (val || '').toLowerCase().trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (v === 'anuragsahu' || emailRegex.test(v)) {
        return true;
      }
      throw new Error('Please provide a valid email address.');
    }),
  body('password')
    .notEmpty()
    .withMessage('Password is required.'),
];

/**
 * Validation Middleware
 * Runs express-validator checks and returns 422 if any fail with standardized error schema.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorList = errors.array().map((e) => ({
      field: e.path || e.param,
      message: e.msg,
    }));
    return sendError(res, 'Validation failed.', 'VALIDATION_ERROR', 422, errorList);
  }
  next();
};

module.exports = { validate, loginRules };

