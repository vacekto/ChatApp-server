const bcrypt = require('bcrypt');
const { InvalidInputError } = require('../errorController.js');
const Room = require('./models/Room');
const User = require('./models/User');
const Message = require('./models/Message');

module.exports = {
    userSearchByName: usernameSearch => new Promise(async (resolve, reject) => {
        try {
            const re = new RegExp(`^${usernameSearch}`);
            const users = await User.find({ username: { $regex: re, $options: 'i' } }, '-password');
            resolve(users)
        }
        catch (err) {
            reject(err)
        }
    }),

    saveMessage: message => new Promise(async (resolve, reject) => {
        try {
            const room = await Room.findOne({ _id: message.room });
            const newMessage = new Message({ ...message, room: room._id });
            room.messages.push(newMessage._id)
            const [savedMessage, savedRoom] = await Promise.all([newMessage.save(), room.save()]);
            resolve(savedMessage);
        }
        catch (err) {
            reject(err)
        }
    }),

    createRoom: data => new Promise(async (resolve, reject) => {
        try {
            const usernames = data.users.map(user => user.username);
            const room = new Room({ name: data.roomName, directChannel: false, users: usernames })
            const [savedRoom, users] = await Promise.all([room.save(), User.find({ username: { $in: usernames } }, '-password')])
            users.forEach(user => {
                user.skipMiddleware = true
                user.rooms.push(savedRoom._id)
            })
            await Promise.all(users.map(user => user.save()))
            resolve({ users, room: savedRoom })
        }
        catch (err) {
            reject(err)
        }
    }),

    authUser: (password, email) => new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({ email })
                .populate({
                    path: 'rooms',
                    populate: { path: 'messages' }
                })
            if (!user) throw new InvalidInputError();
            const match = await bcrypt.compare(password, user.password)
            if (!match) throw new InvalidInputError();
            user.password = '_'
            resolve(user);
        }
        catch (err) {
            reject(err);
        }
    }),

    createUser: (username, password, email) => new Promise(async (resolve, reject) => {
        try {
            const user = new User({ username, password, email });
            const publicRoom = await Room.findOne({ public: true })
            user.rooms.push(publicRoom._id);
            if (!publicRoom.users.find(el => el === username)) publicRoom.users.push(username);
            const [savedUser, savedPublicRoom] = await Promise.all([user.save(), publicRoom.save()]);
            resolve({
                username: savedUser.username,
                email: savedUser.email
            })
        }
        catch (err) {
            reject(err)
        }
    })
}