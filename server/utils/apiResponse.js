/**
 * Standardized API Response Utilities
 */
const sendSuccess = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
  });
};

const sendError = (res, message, code = 'ERROR', statusCode = 400, details = null) => {
  const errorObj = {
    code,
    message,
  };
  if (details) {
    errorObj.details = details;
  }
  return res.status(statusCode).json({
    success: false,
    error: errorObj,
  });
};

module.exports = {
  sendSuccess,
  sendError,
};
