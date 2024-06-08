
import RoomCard from "./Components/RoomCard"
import { Button } from '@/lib/ui/button';
  const rooms = [
    {
    roomTopic: "Dogs",
    description: "A Room to discuss why dogs are better than cats",
    roomId: "12345"
  },
  {
    roomTopic: "Git",
    description: "A Room to discuss git and versioning systems",
    roomId: "098367",
  },
    {
        roomTopic: "Git",
        description: "A Room to discuss git and versioning systems",
        roomId: "09836"
      },
      {
        roomTopic: "Git",
        description: "A Room to discuss git and versioning systems",
        roomId: "08367"
      },
      {
        roomTopic: "Git",
        description: "A Room to discuss git and versioning systems",
        roomId: "0967"
      }
  ]



const RoomList: React.FC = () => {

const cards = rooms.map(room => <RoomCard key={room.roomId} id = {room.roomId} topic = {room.roomTopic} description={room.description} />);

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