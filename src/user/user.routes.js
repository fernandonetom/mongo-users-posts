const express = require('express');
const { check } = require('express-validator');
const authMiddleware = require('../auth/auth.middleware');
const upload = require('../utils/uploadFile');
const userController = require('./user.controller');

const userRoute = express.Router();

userRoute.post('/', [
  upload.single('image'),
  check('name').isString(),
  check('email').isEmail(),
  check('password').isLength({ min: 8 }),
  check('image')
    .custom((_, { req }) => {
      if (!req.file) throw new Error('Image is required');
      return true;
    }),
  userController.create]);

userRoute.put('/', [
  authMiddleware,
  check('name').isString().optional(),
  check('email').isEmail().optional(),
  upload.single('image'),
  userController.update]);

userRoute.put('/update-password', [
  authMiddleware,
  check('password').isString().isLength({ min: 8 }),
  check('newPassword').isString().isLength({ min: 8 }),
  userController.updatePassword]);

module.exports = userRoute;
