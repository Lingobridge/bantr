'use client';

import { io, Socket } from 'socket.io-client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AiOutlineAudio } from 'react-icons/ai';
import { MdAddCircleOutline } from 'react-icons/md';
import { AiTwotoneSmile } from 'react-icons/ai';
import { AiOutlineBars } from 'react-icons/ai';
import { FiSend } from 'react-icons/fi';

import { Input } from '@/lib/ui/input';
import { Button } from '@/lib/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/lib/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/lib/ui/select';

import { languages } from '@/lib/languages';

import JoinRoomModal from '@/app/components/JoinRoomModal';
import Sidebar from '@/app/components/Sidebar';

type SocketOptions = {
  query: {
    roomId: string;
  };
};

interface ChatMessage {
  username: string;
  message: string;
}

export default function Room(): React.JSX.Element {
  const socket = useRef<Socket | null>(null);
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const messageRef = useRef<HTMLInputElement>(null);
  const [username, setUsername] = useState<string>('');
  const [language, setLanguage] = useState<string>('');
  const [showPopup, setShowPopup] = useState<boolean>(true);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    //create new websocket connection with host server and set socket to new socket instance
    if (!params?.id) return;

    socket.current = io({
      query: { roomId: params.id },
    } as SocketOptions);

    return () => {
      //disconnect socket when Room unmounts
      if (socket.current) socket.current.disconnect();
    };
  }, [params.id]);

  useEffect(() => {
    if (!socket.current) return;

    const handleNewUserJoined = (notification: string) => {
      setMessages((prevMessages) => [...prevMessages, notification]);
    };
    const handleRoomJoinConfirm = (confirmation: string) => {
      setMessages((prevMessages) => [...prevMessages, confirmation]);
    };
    const handleUserLeftRoom = (notification: string) => {
      setMessages((prevMessages) => [...prevMessages, notification]);
    };
    const handleNewMessage = async (newMessage: ChatMessage) => {
      const payload = {
        q: newMessage.message,
        target: languages[language],
        format: 'text',
      };

      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const { translation } = await response.json();
          setMessages((prevMessages) => [
            ...prevMessages,
            `${newMessage.username}: ${translation}`,
          ]);
        } else {
          const { error } = await response.json();
          console.log(`Translation was unsucessful: ${error}`);
        }
      } catch (error) {
        console.log(`An error occured when calling /api/translate: ${error}`);
      }
    };

    socket.current.on('new-user-joined', handleNewUserJoined);
    socket.current.on('room-join-confirm', handleRoomJoinConfirm);
    socket.current.on('user-left-room', handleUserLeftRoom);
    socket.current.on('new-message', handleNewMessage);

    return () => {
      //remove event listeners
      if (!socket.current) return;
      socket.current.off('new-user-joined', handleNewUserJoined);
      socket.current.off('room-join-confirm', handleRoomJoinConfirm);
      socket.current.off('user-left-room', handleUserLeftRoom);
      socket.current.off('new-message', handleNewMessage);
    };
  }, [language]);

  const handleSubmit = () => {
    if (username && socket.current) {
      socket.current.emit('set-username', username);
      setShowPopup(false);
    }
  };

  const handleLanguageChange = (value: string) => {
    setLanguage((prevLanguage) => value);
  };

  const handleSendMessage = () => {
    const message = messageRef.current?.value;

    if (message && socket.current) {
      socket.current.emit('send-message', { username, message });
      if (messageRef.current) messageRef.current.value = '';
    }
  };

  return (
    <main>
      {showPopup && (
        <JoinRoomModal
          showPopup={showPopup}
          setShowPopup={setShowPopup}
          setUsername={setUsername}
          handleSubmit={handleSubmit}
          username={username}
          language={language}
          handleLanguageChange={handleLanguageChange}
        />
      )}
      <div className='h-12 w-full flex flex-row items-center bg-slate-200 border'>
        <div className='flex grow items-center justify-center'>
          <div className='font-base text-lg'>Group Chat Room</div>
        </div>
        <div className='fixed right-4 w-12 justify-end'>
          <Sidebar username={username} language={language} />
        </div>
      </div>

      <div className='h-96 overflow-y-auto p-4'>
        {messages.map((msg, index) => (
          <div key={index} className='mb-2'>
            <span>{msg}</span>
          </div>
        ))}
      </div>

      <div className='fixed bottom-0 h-16 w-full flex flex-row justify-center items-center bg-slate-200 border'>
        <AiOutlineAudio className='w-12 text-center text-2xl mx-2' />
        <div className='w-11/12 flex flex-row justify-center items-center'>
          <Input
            id='messageid'
            type='text'
            ref={messageRef}
            className='w-full border-t overflow-y-auto'
            placeholder='Type a message...'
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          ></Input>
          <FiSend
            className='w-10 text-center text-xl'
            onClick={handleSendMessage}
          />
        </div>

        <AiTwotoneSmile className='w-10 text-center text-2xl mx-2' />
        <MdAddCircleOutline className='w-10 text-center text-2xl' />
      </div>
    </main>
  );
}
