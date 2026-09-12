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
  let finalStatus = statusCode;
  let finalCode = code;

  if (typeof code === 'number') {
    finalStatus = code;
    finalCode = code === 404 ? 'NOT_FOUND' : code === 401 ? 'UNAUTHORIZED' : code === 403 ? 'FORBIDDEN' : 'ERROR';
  }

  const errorObj = {
    code: finalCode,
    message,
  };
  if (details) {
    errorObj.details = details;
  }
  return res.status(finalStatus).json({
    success: false,
    error: errorObj,
  });
};

module.exports = {
  sendSuccess,
  sendError,
};
