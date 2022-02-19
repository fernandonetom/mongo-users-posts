const Post = require('../database/models/post');

class PostsService {
  create({
    title, description, image, user,
  }) {
    return Post.create({
      title, description, image, user,
    });
  }

  update({
    id, title, description, image,
  }) {
    return Post.findByIdAndUpdate(id, {
      title, description, image,
    }, {
      new: true,
    });
  }

  list() {
    return Post.find().populate('user');
  }

  findById(id) {
    return Post.findById(id).populate('user');
  }

  removeById(id) {
    return Post.findByIdAndRemove(id);
  }
}

module.exports = new PostsService();
