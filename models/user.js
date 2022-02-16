const mongoose = require('mongoose').Schema;

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true, minlength: 6 },
  authorised: { type: Boolean, default: false },
});

module.exports = mongoose.model('user', userSchema);
