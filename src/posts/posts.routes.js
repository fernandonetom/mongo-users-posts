const express = require('express');
const { check } = require('express-validator');
const upload = require('../utils/uploadFile');
const postsController = require('./posts.controller');

const postsRoute = express.Router();

postsRoute.post('/', [
  upload.single('image'),
  check('title').isString(),
  check('description').isString(),
  check('image')
    .custom((_, { req }) => {
      if (!req.file) throw new Error('Image is required');
      return true;
    }),
  postsController.create,
]);

postsRoute.get(
  '/',
  postsController.list,
);

postsRoute.get(
  '/:postId',
  postsController.findOne,
);

postsRoute.delete(
  '/:postId',
  postsController.delete,
);

postsRoute.put(
  '/:postId',
  [
    upload.single('image'),
    check('title').isString().optional(),
    check('description').isString().optional(),
    postsController.update,
  ],
);

module.exports = postsRoute;
