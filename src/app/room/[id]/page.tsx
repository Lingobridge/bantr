'use client';

import { io, Socket } from 'socket.io-client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AiOutlineAudio } from 'react-icons/ai';
import { MdAddCircleOutline } from 'react-icons/md';
import { AiTwotoneSmile } from 'react-icons/ai';
import { AiOutlineBars } from 'react-icons/ai';
import { FiSend } from 'react-icons/fi';
import {
  Keyboard,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from 'lucide-react';

import { Input } from '@/lib/ui/input';
import { Button } from '@/lib/ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/lib/ui/dropdown-menu';

import { languages } from '@/lib/languages';

import JoinRoomModal from '@/app/components/JoinRoomModal';

type SocketOptions = {
  query: {
    roomId: string;
  };
};

interface ChatMessage {
  username?: string;
  message: string;
}

export default function Room(): React.JSX.Element {
  const socket = useRef<Socket | null>(null);
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const messageRef = useRef<HTMLInputElement>(null);
  const [myUsername, setMyUsername] = useState<string>('');
  const [language, setLanguage] = useState<string>('');
  const [showPopup, setShowPopup] = useState<boolean>(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

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

    const handleNewUserJoined = (notification: ChatMessage) => {
      setMessages((prevMessages) => [...prevMessages, notification]);
    };
    const handleRoomJoinConfirm = (confirmation: ChatMessage) => {
      setMessages((prevMessages) => [...prevMessages, confirmation]);
    };
    const handleUserLeftRoom = (notification: ChatMessage) => {
      setMessages((prevMessages) => [...prevMessages, notification]);
    };
    const handleNewMessage = async (newMessage: ChatMessage) => {
      const payload = {
        q: newMessage.message,
        target: languages[language] || 'en',
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
            { username: newMessage.username, message: translation },
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
    if (myUsername && socket.current) {
      socket.current.emit('set-username', myUsername);
      setShowPopup(false);
    }
  };

  const handleLanguageChange = (value: string) => {
    setLanguage((prevLanguage) => value);
  };

  const handleSendMessage = () => {
    const message = messageRef.current?.value;

    if (message && socket.current) {
      socket.current.emit('send-message', { username: myUsername, message });
      if (messageRef.current) messageRef.current.value = '';
    }
  };

  const handleLeaveRoom = () => {
    if (socket.current) {
      socket.current.emit('leave-room', {
        roomId: params.id,
        username: myUsername,
      });
      socket.current.disconnect();
      router.push('/');
    }
  };

  return (
    <main className='h-full flex flex-col'>
      {showPopup && (
        <JoinRoomModal
          showPopup={showPopup}
          setShowPopup={setShowPopup}
          setMyUsername={setMyUsername}
          handleSubmit={handleSubmit}
          myUsername={myUsername}
          language={language}
          handleLanguageChange={handleLanguageChange}
        />
      )}
      <div className='h-12 w-full flex flex-row items-center bg-slate-200 border'>
        <div className='flex grow items-center justify-center'>
          <div className='font-base text-lg'>Group Chat Room</div>
        </div>
        <div className='fixed right-4 w-12 justify-end'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className='h-12 bg-slate-400 border mr-4 rounded-none'>
                <AiOutlineBars className='w-10 text-center text-2xl justify-end caret-yellow-900' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56'>
              <DropdownMenuLabel>Preference</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User className='mr-2 h-4 w-4' />
                  <span>Username</span>
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className='mr-2 h-4 w-4' />
                  <span>Language</span>
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Keyboard className='mr-2 h-4 w-4' />
                  <span>Keyboard shortcuts</span>
                  <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Users className='mr-2 h-4 w-4' />
                  <span>Team</span>
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <UserPlus className='mr-2 h-4 w-4' />
                    <span>Invite users</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>
                        <Mail className='mr-2 h-4 w-4' />
                        <span>Email</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquare className='mr-2 h-4 w-4' />
                        <span>Message</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <PlusCircle className='mr-2 h-4 w-4' />
                        <span>More...</span>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuItem>
                  <Plus className='mr-2 h-4 w-4' />
                  <span>New Team</span>
                  <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <a
                  href='/'
                  onClick={handleLeaveRoom}
                  className='flex flex-row justify-center items-center'
                >
                  <LogOut className='mr-2 h-4 w-4' />
                  <span>Leave</span>
                </a>
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className='flex-1 overflow-y-auto p-4'>
        {messages.map(({ username, message }, index) => (
          <div
            key={index}
            className={`flex ${
              username === myUsername ? 'justify-end' : 'justify-start'
            } mb-2`}
          >
            <div className='mb-3 w-1/3'>
              <div className='flex flex-col'>
                <p className='text-xs text-gray-400 pl-1 pb-1'>{username}</p>
                <p
                  className={`text-lg rounded-lg ${
                    username === myUsername ? 'bg-teal-200' : 'bg-blue-300'
                  } p-2`}
                >
                  {message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='bottom-0 h-16 w-full flex flex-row justify-center items-center bg-slate-200 border'>
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
