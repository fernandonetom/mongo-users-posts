const errorMessages = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  422: 'Unprocessable Entity',
};

function createError(
  code,
  message,
) {
  let formattedMessage = errorMessages[code] || 'internal server error';

  if (message && Array.isArray(message)) {
    formattedMessage = message
      .map((error) => `${error.param} ${error.msg}`)
      .join(' / ');
  } else if (message && typeof message === 'string') {
    formattedMessage = message;
  }

  const error = new Error(formattedMessage || '');

  return { error, status: code };
}

function resolveErrorFromAxios(error) {
  let statusCode = 500;
  let message;
  if (error?.response && error.response?.status) {
    statusCode = error.response.status;

    if (error.response.data) message = JSON.stringify(error.response.data);
  }

  return { message, statusCode };
}

module.exports = { createError, resolveErrorFromAxios, errorMessages };
