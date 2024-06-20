const mongoose = require('mongoose');

const ManagerSchema = new mongoose.Schema({
  managerId: String,
  managerName: String,
  password: String,
  designation: String,
  section: String,
  appointment:String,
  allProductReport: Boolean,
  demandReceived: Boolean,
  issueProduct: Boolean,
}, { timestamps: true });

module.exports = mongoose.model('Manager', ManagerSchema);
