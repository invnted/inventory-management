const mongoose = require('mongoose');

const DemandSchema = new mongoose.Schema({
  demandId:String,
  userId:String,
  designation:String,
  productType: String,
  productName: String,
  productModel: String,
  productBrand: String,
  additionalDetail: String,
  productQuantity:Number,
}, { timestamps: true });

module.exports = mongoose.model('Demand', DemandSchema);
