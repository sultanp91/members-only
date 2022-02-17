const mongoose = require('mongoose').Schema;
const Post = require('./post');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true, minlength: 6 },
  authorised: { type: Boolean, default: false },
});

userSchema.virtual('posts', () => {
  return Post.find({ author: this._id });
});

module.exports = mongoose.model('user', userSchema);
