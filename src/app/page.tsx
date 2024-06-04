'use client';

import React, { useState } from 'react';
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
} from '@/lib/ui/dialog';
import { Input } from '@/lib/ui/input';
import { Label } from '@/lib/ui/label';
import { Button } from '@/lib/ui/button';

const Home: React.FC = () => {
  const [isOpenStart, setIsOpenStart] = useState(false);
  const [isOpenJoin, setIsOpenJoin] = useState(false);

  const handleStartAConversation = () => {
    setIsOpenStart(true);
  };

  const handleJoinAConversation = () => {
    setIsOpenJoin(true);
  };

  return (
    <main className='relative min-h-screen flex flex-col items-center justify-center'>
      {/* {!isOpenStart && (
        <div className='flex flex-col h-screen items-center justify-center space-y-4'>
          <Button
            onClick={handleStartAConversation}
            className='h-14 w-52 bg-gradient-to-tr from-blue-400 to-blue-600 text-white shadow-lg rounded-lg font-bold'
          >
            Start a Conversation
          </Button>
          <Button
            className='h-14 w-52 bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-lg rounded-lg font-bold'
            onClick={handleJoinAConversation}
          >
            Join a Conversation
          </Button>
        </div>
      )} */}

      <div className='flex justify-center items-center p-2'>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant='outline' onClick={handleStartAConversation}>
              Start a Conversation{' '}
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-md'>
            <DialogHeader>
              <DialogTitle>Share link</DialogTitle>
              <DialogDescription>
                Anyone who has this link will be able to join this room.
              </DialogDescription>
            </DialogHeader>
            <div className='flex items-center space-x-2'>
              <div className='grid flex-1 gap-2'>
                <Label htmlFor='link' className='sr-only'>
                  Link
                </Label>
                <Input
                  id='link'
                  defaultValue='https://localhost:3001/roomcode'
                  readOnly
                />
              </div>
              <Button type='submit' size='sm' className='px-3'>
                <span className='sr-only'>Copy</span>
                <Copy className='h-4 w-4' />
              </Button>
            </div>
            <DialogFooter className='sm:justify-end'>
              <DialogClose asChild>
                <div className='flex space-x-2'>
                  <Button type='button' variant='secondary'>
                    Close
                  </Button>
                  <Button
                    type='button'
                    variant='secondary'
                    className='bg-black text-white'
                  >
                    Submit
                  </Button>
                </div>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className='flex justify-center items-center p-2'>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant='outline' onClick={handleJoinAConversation}>
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
                <Input
                  id='link'
                  defaultValue='https://localhost:3001/roomcode'
                  readOnly
                />
              </div>
            </div>
            <DialogFooter className='sm:justify-end'>
              <DialogClose asChild>
                <div className='flex '>
                  <Button type='button' variant='secondary'>
                    Close
                  </Button>
                  <Button
                    type='button'
                    variant='secondary'
                    className='bg-black text-white'
                  >
                    Submit
                  </Button>
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
