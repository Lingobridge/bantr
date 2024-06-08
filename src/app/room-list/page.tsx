'use client'

import { useEffect, useState } from "react";
import RoomCard from "./Components/RoomCard"
import { Button } from '@/lib/ui/button';






const RoomList: React.FC = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(()=>{
    async function getData(){
    try {
      const response = await fetch('/api/getRooms', {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          },
      });
      
      if (response.ok) {
       const {data} = await response.json()
       setRooms(data)
     
      } else {
      
      }
    } catch (error) {
      console.log(`An error occured when calling /api/translate: ${error}`);
    }

  }
  getData()
  },[])


const cards = rooms.map(room => <RoomCard key={room.room_id} id = {room.room_id} topic = {room.roomTopic} description={room.description} />);

return (
    <>
    <div className="flex w-full justify-center p-12 text-center"> 
    <div>
    <div className="text-6xl mb-4">Get your Bantr on!</div>
    <div className="text-center">Choose a chat room to start.</div>
    <div className="mb-4">Don't see one you like?  </div>
    <Button>Create your own</Button>
    </div>


{!cards.length ? (
    <div className="flex flex-col justify-center w-full h-full items-center">
        <div className="mb-4"> No Rooms available to join. </div>
        <Button>Create one here</Button>
  </div>
   ):(
    <>
  
    <div className="flex flex-wrap w-full h-full justify-center">
{cards}
</div>

  </>
  )
}
</div>
  </>
  
)}




export default RoomList;