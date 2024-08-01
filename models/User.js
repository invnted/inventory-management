const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  email: String,
  password: String,
  designation: String,
  section: String,
  appointment:String,
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
