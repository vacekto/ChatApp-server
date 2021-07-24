const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const validateEmail = function(email) {
    let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const UserSchema = new Schema({
    userName: {
        type: String,
        required: true,
        minlegth: 5,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlegth: 5,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    }
})

const User = mongoose.model('user', UserSchema );

module.exports = User;