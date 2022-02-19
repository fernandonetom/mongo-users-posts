// eslint-disable-next-line no-unused-vars
const handleErrors = (err, req, res, next) => {
  if (err.status) {
    return res.status(err.status).json({
      status: err.status,
      message: err.error.message,
    });
  }

  return res.status(500).json({
    status: 500,
    message: err.message || 'Internal server error',
  });
};

module.exports = handleErrors;
