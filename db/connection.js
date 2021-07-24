const mongoose = require('mongoose');
const URI = process.env.DB_URL;

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

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