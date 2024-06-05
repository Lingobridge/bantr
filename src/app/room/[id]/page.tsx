'use client';

import { io, Socket } from "socket.io-client";
import React, {useState, useEffect, useRef} from "react";
import { useParams } from "next/navigation";

export default function Room () {
    const socketInstance = useRef<Socket | null>(null);
    const params = useParams<{ id: string }>();
  
    useEffect(() => {
        //create new websocket connection with host server and set socket to new socket instance
        const socket = io();
        socketInstance.current = socket;

        return () => {
            //disconnect socket when Room unmounts
            if (socketInstance.current) socketInstance.current.disconnect();
        }
    }, []);

    return (
        <h1></h1>
    );
}




