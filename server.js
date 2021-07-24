const express = require('express');
const cors = require('cors');
const socketio = require('socket.io');
const fs = require('fs');
const https = require('https');
const router = require('./router.js');
const dbConnect = require('./db/connection.js');
const ioConnect = require('./sockets.js');
const PORT = process.env.PORT || 5000

const options = {
    key: fs.readFileSync('Local.key'),
    cert: fs.readFileSync('Local.crt')
};

const app = express();
const httpsServer = https.createServer(options, app);

app.use(cors());
app.use(router);

dbConnect()
    .then(() => {
        console.log('connection to database succesful');
        httpsServer.listen(PORT, () => console.log(`server has started on port ${PORT}`));

        const io = socketio(httpsServer, { cors: { origin: true } })
        ioConnect(io);
    })
    .catch(err => console.log(err))