// import { Socket } from 'socket.io-client';

// import { Socket } from 'socket.io-client';

// import next from 'next';
// import express, { Request, Response } from 'express';
// import { createServer as createHttpServer } from 'http';
// import { Server as WebsocketServer, Socket } from 'socket.io';

const next = require('next');
const express = require('express');
const { createServer: createHttpServer } = require('http');
const { Server: WebsocketServer } = require('socket.io'); //npm install @types/socket.io --save-dev

const port = 3001;

//initialize next app and create handler to retain app router functionality
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

//initialize express
const server = express();
//pass express to http server
const httpServer = createHttpServer(server);

app.prepare().then(() => {
  //initialize ws server using http server
  const io = new WebsocketServer(httpServer);

  io.on('connection', (socket) => {
    //Create (or join) room channel and confirm back to client.
    const roomId = socket.handshake.query.roomId;
    socket.join(roomId);
    socket.emit('room-join-confirm', `You have joined room: ${roomId}`);
    socket.broadcast
      .to(roomId)
      .emit('new-user-joined', `New user joined your room: ${roomId}`);
    // Create a room
    // socket.on('create-room', (roomId) => {
    //   console.log('Creating room:', roomId);
    //   socket.join(roomId);
    //   socket.emit('room-created', roomId); // Notify the client that the room is created
    // });

    // Handle client messages
    socket.on('client-message', (message: string) => {
      console.log(`User sent message: ${message}`);
      socket.broadcast.to(roomId).emit('new-message', message);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected from room: ${roomId}`);
      io.to(roomId).emit('user-left-room', `User left room: ${roomId}`);
    });
  });

  //use next app router to handle all routes
  server.all('*', (req: Request, res: Response) => {
    return handle(req, res);
  });

  httpServer.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
});
