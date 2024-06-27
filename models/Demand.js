const mongoose = require('mongoose');

const DemandSchema = new mongoose.Schema({
  demandId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  designation: { type: String, required: true },
  productType: { type: String, required: true },
  productName: { type: String, required: true },
  productModel: { type: String, required: true },
  productBrand: { type: String, required: true },
  additionalDetail: { type: String, required: true },
  productQuantity: { type: Number, required: true },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING',
  },
  createdAt: { type: String }, 
  updatedAt: { type: String } 
}, { timestamps: true });

// Automatically update timestamps in createdAt and updatedAt fields
DemandSchema.set('timestamps', {
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

// Middleware to format dates before saving
DemandSchema.pre('save', function(next) {
  const now = new Date();
  this.createdAt = formatDate(now);
  this.updatedAt = formatDate(now);
  next();
});

// Function to format date as required
function formatDate(date) {
  const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  const formattedTime = `${date.getHours()}:${date.getMinutes()} ${date.getHours() >= 12 ? 'PM' : 'AM'}`;
  return `Date: ${formattedDate}, Time: ${formattedTime}`;
}

module.exports = mongoose.model('Demand', DemandSchema);
