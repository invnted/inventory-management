const mongoose = require('mongoose');

const ModeratorSchema = new mongoose.Schema({
  moderatorId: String,
  moderatorName: String,
  password: String,
  designation: String,
  section: String,
  appointment:String,
  remark:String,
}, { timestamps: true });

module.exports = mongoose.model('Moderator', ModeratorSchema);
