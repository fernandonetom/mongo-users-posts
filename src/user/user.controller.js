const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const { generateToken } = require('../auth/token.provider');
const { createError } = require('../utils/createErrors');
const { removeIfFileExists } = require('../utils/fs');
const userService = require('./user.service');

class UserController {
  async create(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw createError(422, errors.array());
      }

      const { name, email, password } = req.body;

      const { filename: image } = req.file;

      if (await userService.findByEmail(email)) { throw createError(400, 'User already exists'); }

      const user = await userService.create({
        name, email, password, image,
      });

      user.password = undefined;

      const accessToken = generateToken({ id: user.id });

      return res.status(201).json({ user, accessToken });
    } catch (error) {
      if (req.file) { removeIfFileExists(req.file.path); }
      return next(error);
    }
  }

  async update(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError(422, errors.array()));
    }

    try {
      const { userId: id } = req;
      const { name, email } = req.body;

      const findUser = await userService.findById(id);

      if (!findUser) { throw createError(404); }

      if (email) {
        const findUserByEmail = await userService.findByEmail(email);

        if (findUserByEmail && findUserByEmail.id !== id) {
          throw createError(400, `Another user with ${email} already exists`);
        }
      }

      let image;

      if (req.file) {
        image = req.file.filename;
        removeIfFileExists(process.env.UPLOAD_PATH + findUser.image);
      }

      const user = await userService.update({
        id, name, email, image,
      });

      return res.status(200).json({ user });
    } catch (error) {
      if (req.file) { removeIfFileExists(req.file.path); }
      return next(error);
    }
  }

  async updatePassword(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError(422, errors.array()));
    }

    try {
      const { userId: id } = req;
      const { password, newPassword } = req.body;

      const findUser = await userService.findByIdAndReturnPassword(id);

      if (!findUser) { throw createError(404); }

      if (!bcrypt.compareSync(password, findUser.password)) { throw createError(403); }

      const hash = bcrypt.hashSync(newPassword, 10);

      await userService.update({
        id, password: hash,
      });

      return res.sendStatus(204);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new UserController();
