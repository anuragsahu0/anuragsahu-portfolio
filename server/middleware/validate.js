const { validationResult } = require('express-validator');
const { sendError } = require('../utils/apiResponse');

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

module.exports = { validate };
