const db_API = require('./db/API.js')

const checkUserStatus = id => activeSockets.find(s => s.userId === id) ? 'online' : 'offline'


let activeSockets;

const ioConnect = (io) => {
    activeSockets = []

    io.on('connection', (socket) => {
        console.log('New connection established');
        socket.on('initialize', user => {
            console.log(user)
            activeSockets.push({ socket, userId: user.id })
            user.rooms.forEach(room => socket.join(room._id));
            console.log(activeSockets.length, socket.rooms)
        })

        socket.on('message', (message, callback) => {
            db_API.saveMessage(message)
                .then(savedMessage => {
                    console.log(savedMessage, socket.rooms)
                    io.to(message.room).emit('message', savedMessage);
                    callback({ status: 'ok' });
                })
                .catch(err => console.log(err))
        })

        socket.on('searchForUser', (usernameSearch, callback) => {
            db_API.userSearchByName(usernameSearch)
                .then(data => callback({ status: 'ok', data }))
                .catch(err => callback({ status: 'error', error: err }))
        })

        socket.on('createRoom', data => {
            db_API.createRoom(data)
                .then(result => {
                    const userIdsInRoom = result.users.map(user => user.id);
                    userIdsInRoom.forEach(id => {
                        const soc = activeSockets.find(s => id === s.userId);
                        if (soc) soc.socket.join(result.room.id)
                    })
                    io.to(result.room.id).emit('newRoom', result)
                })
        })

        socket.on('disconnect', () => {
            const index = activeSockets.findIndex(soc => soc.socket.id === socket.id)
            activeSockets.splice(index, 1);
            console.log('user had left');
            console.log(activeSockets.length)
        });
    })
}

module.exports = { ioConnect, checkUserStatus }