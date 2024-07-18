const mongoose = require('mongoose');
const CompanySchema = new mongoose.Schema({
  companyId: String,
  companyName: String,
  email: String,
  alternativeEmail: String,
  contact_1: String,
  contact_2: String,
  password: String,
});

module.exports = mongoose.model('Company', CompanySchema);
