// import { Socket } from 'socket.io-client';

// import next from 'next';
// import express, { Request, Response } from 'express';
// import { createServer as createHttpServer } from 'http';
// import { Server as WebsocketServer, Socket } from 'socket.io';

require('dotenv').config();

const next = require('next');
const express = require('express');
const { createServer: createHttpServer } = require('http');
const { Server: WebsocketServer } = require('socket.io');

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
    console.log('a user connected');

    // Create a room
    socket.on('create-room', roomId => {
      console.log('Creating room:', roomId);
      socket.join(roomId);
      socket.emit('room-created', roomId); // Notify the client that the room is created
    });

    // Handle client messages
    socket.on('client-message', message => {
      console.log(`Message received: ${message}`);
      // socket.emit('client-message', 'Client message');
      setTimeout(() => {
        io.emit('server-message', 'Server message');
      }, 1000);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('user disconnected');
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
