const User = require('../database/models/user');

class UserService {
  create({
    name, email, password, image,
  }) {
    return User.create({
      name, email, password, image,
    });
  }

  findByEmail(email) {
    return User.findOne({ email });
  }

  findById(id) {
    return User.findById(id);
  }

  findByEmailAndReturnPassword(email) {
    return User.findOne({ email }).select('+password');
  }

  findByIdAndReturnPassword(id) {
    return User.findById(id).select('+password');
  }

  update({
    id, name, email, password, image,
  }) {
    return User.findByIdAndUpdate(id, {
      name,
      email,
      image,
      password,
    });
  }
}

module.exports = new UserService();
