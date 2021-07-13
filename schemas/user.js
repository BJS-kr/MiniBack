const mongoose = require('mongoose');

const { Schema } = mongoose;
const userSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  favorite: Array,
});

module.exports = mongoose.model('User', userSchema);
