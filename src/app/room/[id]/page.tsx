'use client';

import { io, Socket } from "socket.io-client";
import React, {useState, useEffect, useRef} from "react";
import { useParams } from "next/navigation";

type SocketOptions = {
    query: {
        roomId: string;
    }
};

export default function Room () {
    const socket = useRef<Socket | null>(null);
    const params = useParams<{ id: string }>();
  
    useEffect(() => {
        //create new websocket connection with host server and set socket to new socket instance
        socket.current = io({
            query: { roomId: params.id }
        } as SocketOptions); 

        socket.current.on('new-user-joined', (notification: string) => {
            console.log(notification);
        });
        socket.current.on('room-join-confirm', (confirmation: string) => {
            console.log(confirmation);
        });
        socket.current.on('user-left-room', (notification: string) => {
            console.log(notification);
        });
        socket.current.on('new-message', (message: string) => {
            console.log(`Someone sent a message: ${message}`);
        });

        //testing out sending a client message after connecting to a room
        setTimeout(() => {
            if (socket.current) socket.current.emit('client-message', 'Client is sending a test message')
        }, 1000);

        return () => {
            //disconnect socket when Room unmounts
            if (socket.current) socket.current.disconnect();
        }
    }, []);

    return (
        <h1></h1>
    );
}




//take room id and join room, and tell server user is joined 
//on server once user joins, broadcast new user joined
//on client, create a send message event, and when message is sent