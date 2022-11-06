const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      required: true,
      type: String,
      minlength: 2,
      maxlength: 30,
    },
  },
);

module.exports = mongoose.model('user', userSchema);
