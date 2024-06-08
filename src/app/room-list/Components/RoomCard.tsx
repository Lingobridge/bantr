'use client';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
  } from "@/components/ui/card"
  import { Label } from '@/lib/ui/label';
  import { Input } from '@/lib/ui/input';
  import { cn } from "@/lib/utils"
import { useRef } from "react";
import { Button } from '@/lib/ui/button';
import { Copy } from 'lucide-react';
import { useRouter } from 'next/navigation'
interface CardProps {
    id: string,
    topic: string,
    description:string
}

const RoomCard: React.FC<CardProps> = ({id, topic, description}) => {
const router = useRouter();
const roomIdRef = useRef(id);

const handleCopy = () =>  {
      // use the Clipboard API:
      navigator.clipboard.writeText(id);
      alert('Copied to clipboard!');
    };

return (
   


    <Card className={cn("w-[380px] flex flex-col mt-4 items-center mx-4")}>
      <CardHeader className="text-center">
        <CardTitle className="mb-2">{topic}</CardTitle>
       
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className=" flex items-center space-x-4 rounded-md  p-4 text-center">
        <CardDescription>{description}</CardDescription>
        </div>
        <div>
          
        </div>
      </CardContent>
      <CardFooter className="flex flex-col">
     
        <Button onClick={()=>router.push(`/room/${id}`)} >Enter</Button>

        <div className='flex items-center'>
                <div className="text-sm">{id}</div>
           
              <Button variant="ghost" onClick = {handleCopy} size='sm' className=''>
                <Copy className="w-4 h-4"></Copy>
                </Button>
                
           
            </div>
  
      </CardFooter>
    </Card>
  
  )
}

export default RoomCard;