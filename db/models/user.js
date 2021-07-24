const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    userName: {
        type: String,
        required: true,
        minlegth: 1,
        trim: true,
        unique: true
    },
    password: String,
    email: String
})

const User = mongoose.model('user', UserSchema );

module.exports = User;