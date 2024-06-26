const mongoose = require('mongoose');

const StoreSchema = new mongoose.Schema({
    orderId:String,
    productId:String,
    userId:String,
  status: {
    type: String,
    enum: ['available', 'out of stock', 'dead stock', 'returned'],
    default: 'available',
  },
}, { timestamps: true });

module.exports = mongoose.model('Store', StoreSchema);
