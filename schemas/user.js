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
    salt: String,
    storedPassword: String,
  },
  favorite: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  userProfile: String,
});

module.exports = mongoose.model('User', userSchema);
