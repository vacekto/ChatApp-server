const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const validateEmail = function (email) {
    let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        minlength: [3, 'Username is too short'],
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [5,'Password is too short'],
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: [true, 'This email address is alreday taken'],
        required: [true, 'Email address is required'],
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    }
})


UserSchema.pre('save', function (next) {
    bcrypt.hash(this.password, 10, (err, passHash) => {
        if(err) return next(err)
        this.password = passHash;
        next();
    })
})

const User = mongoose.model('user', UserSchema);

module.exports = User;