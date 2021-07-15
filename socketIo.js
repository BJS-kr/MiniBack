const { server } = require('./bin/www');
const io = require('socket.io')(server);
const Chat = require('./schemas/chat');
// 로그인한 사용자만 각 채팅방에 입장할 수 있도록, 토큰 검증이 됐을때만 채팅방 입장이 가능하도록 프론트에서 구현(입장 클릭 -> verify -> true일경우 ㄱㄱ)
exports.chat = () => {
  io.sockets.on('connection', (socket) => {
    console.log('확인용 로그: 새로운 소켓 연결됨');

    socket.on('join', async (data) => {
      if (!Object.keys(io.sockets.adapter.rooms).includes(data.room)) {
        if (!(await Chat.findOne({ postId: data.room }))) {
          await Chat.Create({ postId: data.room, chatLog: [] });
        } else {
          const chatLogs = await Chat.findOne({ postId: data.room }).select({
            chatLog: 1,
            _id: 0,
          });
          io.to(data.room).emit('chatLogs', chatLogs);
        }
      }
      socket.name = data.username;
      socket.join(data.room);
      io.to(data.room).emit('updateMessage', {
        name: '오이마켓',
        message: socket.name + '님이 입장하셨습니다.',
      });
    });

    socket.on('disconnect', (data) => {
      io.to(data.room).emit('updateMessage', {
        name: '오이마켓',
        message: socket.name + '님이 퇴장하셨습니다',
      });
    });

    socket.on('sendMessage', async (data) => {
      await Chat.findOneAndUpdate(
        { postId },
        {
          $push: {
            chatLog: { username: data.username, message: data.message },
          },
        }
      );
      io.to(data.room).emit('updateMessage', {
        name: data.username,
        message: data.message,
      });
    });
  });
};
