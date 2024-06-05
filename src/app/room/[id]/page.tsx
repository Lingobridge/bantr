'use client';

import { io, Socket } from 'socket.io-client';
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { AiOutlineAudio } from 'react-icons/ai';
import { MdAddCircleOutline } from 'react-icons/md';
import { AiTwotoneSmile } from 'react-icons/ai';
import { AiOutlineBars } from 'react-icons/ai';

import { Input } from '@/lib/ui/input';

export default function Room() {
  const socket = useRef<Socket | null>(null);
  const params = useParams<{ id: string }>();
  const messageRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    //create new websocket connection with host server and set socket to new socket instance
    socket.current = io();

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
        <AiOutlineAudio className='w-12 text-center text-2xl mr-2' />
        <Input
          id='messageid'
          type='text'
          ref={messageRef}
          className='w-full border-t overflow-y-auto'
          placeholder='Type a message...'
        ></Input>
        <AiTwotoneSmile className='w-10 text-center text-2xl ml-2' />
        <MdAddCircleOutline className='w-10 text-center text-2xl' />
      </div>
    </main>
  );
}
