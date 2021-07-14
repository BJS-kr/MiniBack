const mongoose = require('mongoose');

const { Schema } = mongoose;
const productSchema = new Schema({
  user: Object,
  productName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  productCategory: {
    type: String,
    required: true,
  },
  images: Array,
  imgUploadCnt: Number,
  insertedAt: Number,
});

module.exports = mongoose.model('Product', productSchema);
