const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  ticketId:String,
  issueType: String,
  message: String,
  issuedBy: String,
  productId: String,
  status: {
    type: String,
    enum: ['PENDING', 'UNDER REVIEW', 'RESOLVED'],
    default: 'PENDING',
  },
}, { timestamps: true });

module.exports = mongoose.model('Ticket', TicketSchema);
