const { server } = require('./bin/www');
const io = require('socket.io')(server);

io.sockets.on('connection', (socket) => {
    socket.on('newUserConnect', (name) => {
        socket.name = name;
        io.sockets.emit('updateMessage', {
            name: 'SERVER',
            message: name + '님이 접속했습니다.',
        });
    });

    socket.on('disconnect', () => {
        io.sockets.emit('updateMessage', {
            name: 'SERVER',
            message: socket.name + '님이 퇴장하셨습니다'
        });
    });

    socket.on('sendMessage', (data) => {
        data.name = socket.name;
        io.sockets.emit('updateMessage', data);
    })
});

module.exports = socketIo