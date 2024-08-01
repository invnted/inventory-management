const mongoose = require('mongoose');

const ModeratorSchema = new mongoose.Schema({
  moderatorId: String,
  moderatorName: String,
  email: String,
  password: String,
  designation: String,
  section: String,
  appointment:String,
}, { timestamps: true });

module.exports = mongoose.model('Moderator', ModeratorSchema);
