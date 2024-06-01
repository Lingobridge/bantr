import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const PORT = 3000;
const app = express();
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
  // Create Socket.IO server
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH'],
  },
});

io.on('connection', (socket) => {
  console.log('User is connected');

  socket.on('disconnect', () => {
    console.log('User is disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
