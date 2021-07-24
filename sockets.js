const socketio = require('socket.io');

const ioConnect = (io) => {

    io.on('connection', (socket) => {
        console.log('we have a new connection');

        socket.on('disconnect', () => {
            console.log('user had left');
        });

        socket.on('join', ({ name, room }, callback) => {
            const { error, user } = addUser({ id: socket.id, name, room });
            if (error) return callback(error);

            socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}` });
            socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, has joined` });
            socket.join(user.room);
            callback();
        });

        socket.on('sendMessage', (message, callback) => {
            console.log('sendMessage;')
            const user = getUser(socket.id);
            io.to(user.room).emit('message', { user: user.name, text: message });
            callback();
        })
    })
}

module.exports = ioConnect