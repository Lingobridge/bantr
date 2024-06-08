'use client';

import { useEffect, useState, useRef } from 'react';
import RoomCard from './Components/RoomCard';
import Link from 'next/link';
import axios from 'axios';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../lib/ui/dialog';
import { Input } from '../../lib/ui/input';
import { Label } from '../../lib/ui/label';
import { Copy } from 'lucide-react';
import { Button } from '@/lib/ui/button';
import JoinRoomModal from '../components/JoinRoomModal';

const RoomList: React.FC = () => {
  const [rooms, setRooms] = useState([]);
  const [roomId, setRoomId] = useState<string>('');
  const [isOpenStart, setIsOpenStart] = useState(false);
  const roomIdRef = useRef<HTMLInputElement>(null);
  const topicRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function getData() {
      try {
        const response = await fetch('/api/getRooms', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const { data } = await response.json();
          console.log(data);
          setRooms(data);
        } else {
        }
      } catch (error) {
        console.log(`An error occured when calling /api/translate: ${error}`);
      }
    }
    getData();
  }, []);

  interface Room {
    room_id: string;
    topic: string;
    description: string;
  }
  const cards = rooms.map((room: Room) => (
    <RoomCard
      key={room.room_id}
      id={room.room_id}
      topic={room.topic}
      description={room.description}
    />
  ));

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

  return (
    <>
      <div className='flex w-full justify-center p-12 text-center'>
        <div>
          <div className='text-6xl mb-4'>Get your Bantr on!</div>
          <div className='text-center'>Choose a chat room to start.</div>
          <div className='mb-4'>Don't see one you like? </div>
          {/* <Button onClick={handleStartAConversation}>Create your own</Button> */}

          <div className='flex justify-center items-center p-2'>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant='outline'
                  onClick={handleStartAConversation}
                  className='w-48 rounded-lg border-2'
                >
                  Create your own room
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
                        value={roomId}
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
        </div>

        {!cards.length ? (
          <div className='flex flex-col justify-center w-full h-full items-center'>
            <div className='mb-4'> No Rooms available to join. </div>
            <Button>Create one here</Button>
          </div>
        ) : (
          <>
            <div className='flex flex-wrap w-full h-full justify-center'>
              {cards}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default RoomList;
