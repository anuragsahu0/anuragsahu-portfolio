/**
 * Standardized API Response Utilities
 */
const sendSuccess = (res, data, statusCodeOrMessage = 200, maybeMessage = null) => {
  let statusCode = 200;
  let message = null;

  if (typeof statusCodeOrMessage === 'number') {
    statusCode = statusCodeOrMessage;
    if (typeof maybeMessage === 'string') message = maybeMessage;
  } else if (typeof statusCodeOrMessage === 'string') {
    message = statusCodeOrMessage;
    if (typeof maybeMessage === 'number') statusCode = maybeMessage;
  }

  const response = {
    success: true,
    data,
  };
  if (message) {
    response.message = message;
  }

  return res.status(statusCode).json(response);
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
