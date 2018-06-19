const mongoose = require('mongoose');
const { Schema } = mongoose;
const crypto = require('crypto');
const { generateToken } = require('lib/token');

function hash(password) {
  return crypto
    .createHmac('sha256', process.env.SECRET_KEY)
    .update(password)
    .digest('hex');
}

const User = new Schema({
  username: String,
  password: String,
  admin: {
    type: Boolean,
    default: false
  }
});

User.statics.getAllList = function() {
  return this.find();
};

User.statics.create = function(username, password) {
  const user = new this({
    username,
    password: hash(password)
  });

  return user.save();
};

User.statics.findByUsername = function(username) {
  return this.findOne({ username });
};

User.statics.getCount = function() {
  return this.count();
};

User.methods.assignAdmin = function() {
  this.admin = true;
  return this.save();
};

User.methods.validatePassword = function(password) {
  const hashed = hash(password);

  return hashed === this.password;
};

User.methods.generateToken = function() {
  const payload = {
    _id: this._id,
    username: this.username,
    admin: this.admin
  };

  return generateToken(payload);
};

module.exports = mongoose.model('User', User);
