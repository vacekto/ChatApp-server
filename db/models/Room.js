const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    public: Boolean,
    name: {
        type: String,
        required: true
    },
    directChannel: {
        type: Boolean,
        require: true
    },
    users: [{
        type: String,
        trim: true
    }],
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'Message'
    }],
})

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;