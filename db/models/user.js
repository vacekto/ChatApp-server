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
        unique: [true, 'This username address is alreday taken'],
        minlength: [3, 'Username is too short'],
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [5, 'Password is too short'],
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: [true, 'This email address is alreday taken'],
        required: [true, 'Email address is required'],
        validate: [validateEmail, 'Email address not valid'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    rooms: [{
        type: Schema.Types.ObjectId,
        ref: 'Room'
    }]

})


UserSchema.pre('save', function (next) {
    if (this.skipMiddleware) {
        next()
    }
    
    bcrypt.hash(this.password, 12, (err, passHash) => {
        if (err) return next(err)
        this.password = passHash;
        next();
    })

})

const User = mongoose.model('User', UserSchema);

module.exports = User;