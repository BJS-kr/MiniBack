const { server } = require('./bin/www');
const io = require('socket.io')(server);

// 로그인한 사용자만 각 채팅방에 입장할 수 있도록, 토큰 검증이 됐을때만 채팅방 입장이 가능하도록 프론트에서 구현(입장 클릭 -> verify -> true일경우 ㄱㄱ)
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