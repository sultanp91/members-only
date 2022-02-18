const mongoose = require('mongoose');
const Post = require('./post');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true, minlength: 6 },
  authorised: { type: Boolean, default: false },
});

userSchema.virtual('posts', () => {
  return Post.find({ author: this._id });
});

module.exports = mongoose.model('user', userSchema);
