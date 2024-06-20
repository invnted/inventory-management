const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  profileId: String,
  adminName: String,
  email: String,
  role: {
    type: String,
    enum: ['superadmin', 'manager', 'user'],
    default: 'superadmin',
  },
  department:String,
  password: String,
}, { timestamps: true });

module.exports = mongoose.model('Admin', AdminSchema);
