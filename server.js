require('dotenv').config()

const express = require('express');
const cors = require('cors');
const socketio = require('socket.io');
const fs = require('fs');
const http = require('http');
const https = require('https');
const router = require('./router.js');
const dbConnect = require('./db/connection.js');
const ioConnect = require('./sockets.js');
const HTTP_PORT = process.env.HTTP_PORT || 8080
const HTTPS_PORT = process.env.HTTPS_PORT || 5000

const options = {
    key: fs.readFileSync('Local.key'),
    cert: fs.readFileSync('Local.crt')
};

const app = express();
const httpServer = http.createServer(app);
const httpsServer = https.createServer(options, app);

app.use(cors());
app.use(express.json())
app.use(router);

dbConnect()
    .then(() => {
        console.log('connection to database succesful');
        httpServer.listen(HTTP_PORT, () => console.log(`server has started on port ${HTTP_PORT}`))
        httpsServer.listen(HTTPS_PORT, () => console.log(`server has started on port ${HTTPS_PORT}`));

        const io = socketio(httpsServer, { cors: { origin: true } })
        ioConnect(io);
    })
    .catch(err => console.log(err))