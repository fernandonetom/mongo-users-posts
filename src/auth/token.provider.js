const jwt = require('jsonwebtoken');

function generateToken(params) {
  return jwt.sign(
    params,
    process.env.SECRET,

    {
      expiresIn: 86400, // 1 day
    },
  );
}

function verifyToken(token) {
  return jwt.verify(token, process.env.SECRET);
}

module.exports = { generateToken, verifyToken };
