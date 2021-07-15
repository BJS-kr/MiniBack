const { server } = require('./app');
require('./socketIo');

server.listen(process.env.PORT || 3000);
