import { io, Socket } from 'socket.io-client';

const socket: Socket = io({
  path: '/api/server',
});

export default socket;
