import React, { useEffect } from 'react';
import socketIO from 'socket.io-client';

const WS = 'http://localhost:8080';

const App = () => {
  useEffect(() => {
    const socket = socketIO(WS);
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Let us Talk</h1>
    </div>
  );
};

export default App;
