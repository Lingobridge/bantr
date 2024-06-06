
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

  import { cn } from "@/lib/utils"

  const rooms = [{
    roomTopic: "Dogs",
    roomId: 1
  },
  {
    roomTopic: "Git",
    roomId: 2
  }]

const RoomList: React.FC = () => {
type CardProps = React.ComponentProps<typeof Card>
return (
   


    <Card className={cn("w-[380px]")}>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className=" flex items-center space-x-4 rounded-md border p-4">
         
        </div>
        <div>
          
        </div>
      </CardContent>
      <CardFooter>
     
      </CardFooter>
    </Card>
  
  )
}




export default RoomList;