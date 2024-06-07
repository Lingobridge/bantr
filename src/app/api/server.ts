// import { Socket } from 'socket.io-client';
// import next from 'next';
// import express, { Request, Response } from 'express';
// import { createServer as createHttpServer } from 'http';
// import { Server as WebsocketServer, Socket } from 'socket.io';

require('dotenv').config();

const next = require('next');
const express = require('express');
const { createServer: createHttpServer } = require('http');
const { Server: WebsocketServer } = require('socket.io'); //npm install @types/socket.io --save-dev

const port = process.env.PORT || 3000;

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

  io.on('connection', socket => {
    //Create (or join) room channel and confirm back to client.
    const roomId = socket.handshake.query.roomId;
    socket.join(roomId);
    socket.emit('room-join-confirm', `You have joined room: ${roomId}`);
    // socket.broadcast
    //   .to(roomId)
    //   .emit('new-user-joined', `New user joined your room: ${roomId}`);
    // Create a room
    // socket.on('create-room', (roomId) => {
    //   console.log('Creating room:', roomId);
    //   socket.join(roomId);
    //   socket.emit('room-created', roomId); // Notify the client that the room is created
    // });

    // Set username
    socket.on('set-username', (username) => {
      socket.on('set-username', (username) => {
        socket.username = username;
        io.to(roomId).emit(
          'new-user-joined',
          `${username} has joined the room`
        );
      });

      // Handle client messages
      socket.on('send-message', (data) => {
        const { username, message } = data;
        console.log(`User ${username} sent message: ${message}`);
        io.to(roomId).emit('new-message', `${username}: ${message}`);
      });

      // Handle disconnect
      socket.on('disconnect', (username) => {
        console.log(`User disconnected from room: ${roomId}`);
        io.to(roomId).emit('user-left-room', `${username} left room.`);
      });
    });
  });
      });

  //use next app router to handle all routes
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
});
