const { validationResult } = require('express-validator');
const { createError } = require('../utils/createErrors');
const { removeIfFileExists } = require('../utils/fs');
const postsService = require('./posts.service');

class PostsController {
  async create(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file) { removeIfFileExists(req.file.path); }
      return next(createError(422, errors.array()));
    }

    try {
      const { title, description } = req.body;
      const { filename: image } = req.file;

      const post = await postsService.create({
        title, description, image, user: req.userId,
      });

      return res.status(201).json(post);
    } catch (error) {
      removeIfFileExists(req.file.path);
      return next(createError(500));
    }
  }

  async update(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file) { removeIfFileExists(req.file.path); }
      return next(createError(422, errors.array()));
    }

    try {
      const { userId } = req;
      const { title, description } = req.body;
      const { postId: id } = req.params;

      const findPost = await postsService.findById(id);

      if (!findPost) throw createError(404);
      if (findPost.user.id !== userId) throw createError(403);

      let image;

      if (req.file) {
        image = req.file.filename;
        removeIfFileExists(process.env.UPLOAD_PATH + findPost.image);
      }

      const post = await postsService.update({
        id,
        title,
        description,
        image,
      });

      return res.status(200).json(post);
    } catch (error) {
      if (req.file) { removeIfFileExists(req.file.path); }
      return next(error);
    }
  }

  async list(req, res, next) {
    try {
      const posts = await postsService.list();

      return res.json(posts);
    } catch (error) {
      return next(createError(500));
    }
  }

  async findOne(req, res, next) {
    try {
      const { postId } = req.params;
      const post = await postsService.findById(postId);

      if (!post) return next(createError(404));

      return res.json(post);
    } catch (error) {
      return next(createError(500));
    }
  }

  async delete(req, res, next) {
    try {
      const { postId } = req.params;
      const { userId } = req;
      const post = await postsService.findById(postId);

      if (!post) return next(createError(404));
      if (post.user.id !== userId) return next(createError(403));

      await postsService.removeById(postId);

      removeIfFileExists(process.env.UPLOAD_PATH + post.image);

      return res.sendStatus(204);
    } catch (error) {
      return next(createError(500));
    }
  }
}

module.exports = new PostsController();
