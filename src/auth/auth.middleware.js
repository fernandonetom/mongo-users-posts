const { createError } = require('../utils/createErrors');
const { verifyToken } = require('./token.provider');

function authMiddleware(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) return next(createError(401, 'No token informed'));

  const parts = authorization.split(' ');

  if (parts.length !== 2) return next(createError(401, 'Token bad formatted'));

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) return next(createError(401, 'Token scheme invalid'));

  try {
    const decoded = verifyToken(token);

    req.userId = decoded.id;
  } catch (error) {
    return next(createError(401, 'Invalid token'));
  }

  return next();
}

module.exports = authMiddleware;
