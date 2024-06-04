// import { Socket } from 'socket.io-client';

import next from 'next';
import express, { Request, Response } from 'express';
import { createServer as createHttpServer } from 'http';
import { Server as WebsocketServer, Socket } from 'socket.io';

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

  io.on('connection', (socket: Socket) => {
    console.log('a user connected');
    socket.on('client-message', (message: String) => {
      console.log(`Message received: ${message}`);
      // socket.emit('client-message', 'Client message');
      setTimeout(() => {
        io.emit('server-message', 'Server message');
      }, 1000);
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
