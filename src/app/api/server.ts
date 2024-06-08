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

    // Set user name
    socket.on('set-username', (username) => {
      socket.username = username;
      socket.broadcast.to(roomId).emit('new-user-joined', `${username} has joined the room`);
    });

    // Handle client messages
    socket.on('send-message', ({ username, message }) => {
      socket.broadcast.to(roomId).emit('new-message', { username, message });
    });

    //Handle user leaving room
    socket.on('leave-room', ({ roomId, username }) => {
      socket.broadcast.to(roomId).emit('user-left-room', `${username} left the room.`);
    });

    // Handle disconnect
    //passing username into this callback was causing unexpected behavior, so I took it out
    socket.on('disconnect', () => {
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
