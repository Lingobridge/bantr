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

type SocketOptions = {
  query: {
    roomId: string;
  };
};

interface ChatMessage {
    username: string,
    message: string
}

export default function Room() {
  const socket = useRef<Socket | null>(null);
  const params = useParams<{ id: string }>();
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

    socket.current.on('new-user-joined', (notification: string) => {
      setMessages((prevMessages) => [...prevMessages, notification]);
    });

    socket.current.on('room-join-confirm', (confirmation: string) => {
      setMessages((prevMessages) => [...prevMessages, confirmation]);
    });

    socket.current.on('user-left-room', (notification: string) => {
      setMessages((prevMessages) => [...prevMessages, notification]);
    });
    socket.current.on('new-message', async (newMessage: ChatMessage) => {

      const payload = {
          q: newMessage.message,
          target: languages[language],
          format: 'text'
      };
      //TODO: add error handler
      const result = await fetch('/api/translate', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
      });
      const { translation: translatedMessage } = await result.json();
      setMessages((prevMessages) => [...prevMessages, `${newMessage.username}: ${translatedMessage}`]);
    });

    return () => {
      //disconnect socket when Room unmounts
      if (socket.current) socket.current.disconnect();
    };
  }, [params.id, language]);

  const handleSubmit = () => {
    if (username && socket.current) {
      socket.current.emit('set-username', username);
      setShowPopup(false);
    }
  };

  const handleLanguageChange = (value: string) => {
    setLanguage((prevLanguage) => value);
    console.log('>>> current Language Preference: ', value);
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
        <Dialog open={showPopup} onOpenChange={setShowPopup}>
          <DialogContent className='sm:max-w-md'>
            <DialogHeader>
              <DialogTitle>Enter your name</DialogTitle>
            </DialogHeader>
            <Input
              id='name'
              type='text'
              value={username}
              placeholder='Your name'
              onChange={(e) => setUsername(e.target.value)}
            />
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className=''>
                <SelectValue placeholder='Select your preferred language' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Indo-European</SelectLabel>
                  <SelectItem value='English'>English</SelectItem>
                  <SelectItem value='Spanish'>Spanish</SelectItem>
                  <SelectItem value='Hindi'>Hindi</SelectItem>
                  <SelectItem value='Bengali'>Bengali</SelectItem>
                  <SelectItem value='Russian'>Russian</SelectItem>
                  <SelectItem value='Portuguese'>Portuguese</SelectItem>
                  <SelectItem value='German'>German</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Sino-Tibetan</SelectLabel>
                  {/* <SelectItem value='Mandarin'>Mandarin</SelectItem> */}
                  {/* <SelectItem value='Cantonese'>Cantonese</SelectItem> */}
                  <SelectItem value='Chinese'>Chinese</SelectItem>
                  {/* <SelectItem value='Tibetan'>Tibetan</SelectItem> */}
                  <SelectItem value='Burmese'>Burmese</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Afro-Asiatic</SelectLabel>
                  <SelectItem value='Arabic'>Arabic</SelectItem>
                  <SelectItem value='Hebrew'>Hebrew</SelectItem>
                  <SelectItem value='Amharic'>Amharic</SelectItem>
                  <SelectItem value='Somali'>Somali</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Niger-Congo</SelectLabel>
                  <SelectItem value='Swahili'>Swahili</SelectItem>
                  <SelectItem value='Yoruba'>Yoruba</SelectItem>
                  <SelectItem value='Igbo'>Igbo</SelectItem>
                  <SelectItem value='Zulu'>Zulu</SelectItem>
                </SelectGroup>
                {/* <SelectGroup> */}
                  {/* <SelectLabel>Austronesian</SelectLabel> */}
                  {/* <SelectItem value='Indonesian'>Indonesian</SelectItem> */}
                  {/* <SelectItem value='Tagalog'>Tagalog</SelectItem> */}
                  {/* <SelectItem value='Maori'>Maori</SelectItem> */}
                  {/* <SelectItem value='Dravidian'>Dravidian</SelectItem> */}
                {/* </SelectGroup> */}
                <SelectGroup>
                  <SelectLabel>Austronesian</SelectLabel>
                  <SelectItem value='Indonesian'>Indonesian</SelectItem>
                  <SelectItem value='Tagalog'>Tagalog</SelectItem>
                  <SelectItem value='Maori'>Maori</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Dravidian</SelectLabel>
                  <SelectItem value='Tamil'>Tamil</SelectItem>
                  <SelectItem value='Telugu'>Telugu</SelectItem>
                  <SelectItem value='Kannada'>Kannada</SelectItem>
                  <SelectItem value='Malayalam'>Malayalam</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Turkic</SelectLabel>
                  <SelectItem value='Turkish'>Turkish</SelectItem>
                  <SelectItem value='Uzbek'>Uzbek</SelectItem>
                  <SelectItem value='Kazakh'>Kazakh</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Uralic</SelectLabel>
                  <SelectItem value='Finnish'>Finnish</SelectItem>
                  <SelectItem value='Hungarian'>Hungarian</SelectItem>
                  <SelectItem value='Estonian'>Estonian</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <DialogFooter className='sm:justify-end'>
              <Button
                type='button'
                variant='secondary'
                onClick={handleSubmit}
                className='bg-black text-white hover:bg-gray-300 hover:text-black'
              >
                Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <div className='h-12 w-full flex flex-row items-center bg-slate-200 border'>
        <div className='flex grow items-center justify-center'>
          <div className='font-base text-lg'>Group Chat Room</div>
        </div>
        <div className='fixed right-4 w-12 justify-end'>
          <AiOutlineBars className='w-10 text-center text-2xl justify-end' />
        </div>
      </div>

      <div className='h-96 overflow-y-auto p-4'>
        {messages.map((msg, index) => (
          <div key={index} className='mb-2'>
            {msg}
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
