const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    text: {
        type: String,
        trim: true
    },
    author: {
        type: String,
        trim: true
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: 'Room'
    },
    directChannel: Boolean
})

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;