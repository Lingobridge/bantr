'use client';

import { io, Socket } from 'socket.io-client';
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { AiOutlineAudio } from 'react-icons/ai';
import { MdAddCircleOutline } from 'react-icons/md';
import { AiTwotoneSmile } from 'react-icons/ai';
import { AiOutlineBars } from 'react-icons/ai';
import { FiSend } from 'react-icons/fi';

import { Input } from '@/lib/ui/input';

type SocketOptions = {
  query: {
    roomId: string;
  };
};

export default function Room() {
  const socket = useRef<Socket | null>(null);
  const params = useParams<{ id: string }>();
  const messageRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    //create new websocket connection with host server and set socket to new socket instance
    socket.current = io({
      query: { roomId: params.id },
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
      if (socket.current)
        socket.current.emit(
          'client-message',
          'Client is sending a test message'
        );
    }, 1000);

    return () => {
      //disconnect socket when Room unmounts
      if (socket.current) socket.current.disconnect();
    };
  }, []);

  return (
    <main>
      <div className='h-12 w-full flex flex-row items-center bg-slate-200 border'>
        <div className='flex grow items-center justify-center'>
          <div className='font-base text-lg'>Group Chat Room</div>
        </div>
        <div className='fixed right-4 w-12 justify-end'>
          <AiOutlineBars className='w-10 text-center text-2xl justify-end' />
        </div>
      </div>

      <div className='h-96'></div>

      <div className='fixed bottom-0 h-16 w-full flex flex-row justify-center items-center bg-slate-200 border'>
        <AiOutlineAudio className='w-12 text-center text-2xl mx-2' />
        <div className='w-11/12 flex flex-row justify-center items-center'>
          <Input
            id='messageid'
            type='text'
            ref={messageRef}
            className='w-full border-t overflow-y-auto'
            placeholder='Type a message...'
          ></Input>
          <FiSend className='w-10 text-center text-xl' />
        </div>

        <AiTwotoneSmile className='w-10 text-center text-2xl mx-2' />
        <MdAddCircleOutline className='w-10 text-center text-2xl' />
      </div>
    </main>
  );
}
