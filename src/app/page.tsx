'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Copy } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../lib/ui/dialog';
import { Input } from '../lib/ui/input';
import { Label } from '../lib/ui/label';
import { Button } from '../lib/ui/button';
import axios from 'axios';
import Link from 'next/link';

// import socket from '../lib/socket';

const Home: React.FC = () => {
  const [isOpenStart, setIsOpenStart] = useState(false);
  const [isOpenJoin, setIsOpenJoin] = useState(false);
  const [roomId, setRoomId] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const roomIdRef = useRef<HTMLInputElement>(null);
  const topicRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {
    if (roomIdRef.current) {
      roomIdRef.current.select();
      // use the Clipboard API:
      navigator.clipboard.writeText(roomIdRef.current.value);
      alert('Copied to clipboard!');
    }
  };

  const handleStartAConversation = async () => {
    setIsOpenStart(true);
    try {
      const response = await axios.post('/api/room');
      setRoomId(response.data.roomId);
    } catch (err) {
      console.error('Error creating room:', err);
    }
  };

  const handleJoinAConversation = () => {
    setIsOpenJoin(true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoomId(event.target.value);
  };

  return (
    <main className='relative min-h-screen flex flex-col items-center justify-center'>
      <div className='flex justify-center items-center p-2'>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant='outline'
              onClick={handleStartAConversation}
              className='w-48 rounded-lg border-2'
            >
              Start a Conversation{' '}
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-md'>
            <DialogHeader>
              <DialogTitle>Create your room</DialogTitle>
              <DialogDescription>
                Anyone who has this link will be able to join this room.
              </DialogDescription>
            </DialogHeader>
            <div className='flex flex-col items-center space-y-2'>
              <Input
                id='topic'
                type='text'
                placeholder='What is the room topic'
                ref={topicRef}
                className='w-full'
              />
              <Input
                id='description'
                type='text'
                placeholder='Description for the room topic'
                ref={descriptionRef}
                className='w-full'
              />
              <div className='flex flex-col space-y-2 w-full'>
                <Label htmlFor='link' className='sr-only'>
                  Link
                </Label>
                <div className='flex gap-2'>
                  <Input
                    id='link'
                    type='text'
                    defaultValue={roomId}
                    ref={roomIdRef}
                    readOnly
                    className='flex-1'
                  />
                  <Button onClick={handleCopy} size='sm' className='px-3'>
                    <span className='sr-only'>Copy</span>
                    <Copy className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter className='sm:justify-end'>
              <DialogClose asChild>
                <div className='flex space-x-2'>
                  <Button type='button' variant='secondary'>
                    Close
                  </Button>
                  <Link href={`/room/${roomId}`}>
                    <Button
                      type='button'
                      variant='secondary'
                      className='bg-black text-white hover:bg-gray-300 hover:text-black'
                    >
                      Submit
                    </Button>
                  </Link>
                </div>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className='flex justify-center items-center p-2'>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant='outline'
              onClick={handleJoinAConversation}
              className='w-48 rounded-lg border-2'
            >
              Join a Conversation{' '}
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-md'>
            <DialogHeader>
              <DialogTitle>Enter room code</DialogTitle>
              <DialogDescription>Join the room with the host</DialogDescription>
            </DialogHeader>
            <div className='flex items-center space-x-2'>
              <div className='grid flex-1 gap-2'>
                <Label htmlFor='link' className='sr-only'>
                  Link
                </Label>
                <Input id='roomid' type='text' onChange={handleInputChange} />
              </div>
            </div>
            <DialogFooter className='sm:justify-end'>
              <DialogClose asChild>
                <div className='flex '>
                  <Button type='button' variant='secondary'>
                    Close
                  </Button>
                  <Link href={`/room/${roomId}`}>
                    <Button
                      type='button'
                      variant='secondary'
                      onClick={handleJoinAConversation}
                      className='bg-black text-white hover:bg-gray-300 hover:text-black'
                    >
                      Submit
                    </Button>
                  </Link>
                </div>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
};

export default Home;
