const mongoose = require('mongoose');
const URI = 'mongodb://localhost/chatApp';

const dbConnect = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
            .then((res, err) => {
                if (err) return err;
                resolve();
            })
    })
}

module.exports = dbConnect;