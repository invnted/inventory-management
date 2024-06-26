const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  productId:String,
  productType: String,
  productName: String,
  productModel: String,
  productBrand: String,
  productPrice: Number,
  additionalDetail: String,
  status: {
    type: String,
    enum: ['HELD', 'BER', 'ISSUED','UNSERVICEABLE','SERVICEABLE'],
    default: 'SERVICEABLE',
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
