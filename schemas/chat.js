const { Schema } = require('mongoose');

const chatSchema = new Schema({
  postId: String,
  chatLog: Array,
});

module.exports = mongoose.model('Chat', chatSchema);
