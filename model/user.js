const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { collection: 'users' },
);

const User = mongoose.model('UserSchema', UserSchema);

module.exports.User = User;
