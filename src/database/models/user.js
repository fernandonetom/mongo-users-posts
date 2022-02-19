const bcrypt = require('bcrypt');
const mongodb = require('../mongodb');

const UserSchema = new mongodb.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  image: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

UserSchema.pre('save', function (next) {
  const hash = bcrypt.hashSync(this.password, 10);
  this.password = hash;

  next();
});

const User = mongodb.model('User', UserSchema);

module.exports = User;
