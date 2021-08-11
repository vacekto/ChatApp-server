const mongoose = require('mongoose');
const Room = require('../db/models/Room.js')
const URI = process.env.DB_URL;


mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const dbConnect = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
            .then((res, err) => {
                if (err) return err;
                return Room.findOne({ public: true })
            })
            .then(publicRoom => {
                if (!publicRoom) {
                    const publicRoom = new Room({ public: true, name: 'Public', directChannel: false });
                    return publicRoom.save();
                }
            })
            .then(() => resolve())
            .catch(err => reject(err))
    })
}

module.exports = dbConnect;