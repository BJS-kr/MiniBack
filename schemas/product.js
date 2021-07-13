const mongoose = require('mongoose');

const { Schema } = mongoose;
const productSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
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
  category: {
    type: String,
    required: true,
  },
  imgPath: [
    {
      type: String,
      required: true,
    },
  ],
  date: {
    type: String,
  },
});

module.exports = mongoose.model('Product', productSchema);
