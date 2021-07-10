const mongoose = require('mongoose');

const { Schema } = mongoose;
const userSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    favorite: {
        type: [String]
    }
});

module.exports = mongoose.model("User", userSchema);