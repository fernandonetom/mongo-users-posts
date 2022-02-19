const express = require('express');
const { check } = require('express-validator');
const authController = require('./auth.controller');

const authRoute = express.Router();

authRoute.post('/', [
  check('email').isEmail(),
  check('password').isLength({ min: 8 }),
  authController.auth,
]);

module.exports = authRoute;
