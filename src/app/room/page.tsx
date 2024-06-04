'use client';

import { io } from "socket.io-client";
import React, {useState, useEffect} from "react";

export default function Room () {
    const [message, setMessage] = useState('TESTING H1');
    
    useEffect(() => {
        const socket = io();
        socket.emit('client-message', 'client message');
        socket.on('server-message', (message) => {
            console.log(`Message received ${message}`)
            setMessage(message);
        })
    }, []);

    return (
        <h1>{message}</h1>
    );
}




