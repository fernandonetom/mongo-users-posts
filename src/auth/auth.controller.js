const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const userService = require('../user/user.service');
const { createError } = require('../utils/createErrors');
const { generateToken } = require('./token.provider');

class AuthController {
  async auth(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError(422, errors.array()));
    }

    try {
      const { email, password } = req.body;

      const user = await userService.findByEmailAndReturnPassword(email);

      if (!user) return next(createError(401));

      if (!bcrypt.compareSync(password, user.password)) { return next(createError(401)); }

      const accessToken = generateToken({ id: user.id });

      user.password = undefined;

      return res.json({ user, accessToken });
    } catch (error) {
      return next(createError(500));
    }
  }
}

module.exports = new AuthController();
