import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabaseClient';

type Data =
  | {
      room_id: string;
      topic: string;
    }[]
  | null;

type Error = {
  message: string;
};

export default async function POST(req: NextRequest) {
  console.log('Attempting to add Room ID to "rooms" table in database...');

  // Grab 'roomId' from the parsed JSON body of the request
  const { roomId, topic } = await req.json();

  // Error handler for missing Room ID in request body
  if (!roomId) {
    return NextResponse.json({ error: 'Room ID is required' }, { status: 400 });
  }

  // Store Room ID into 'rooms' table in database
  const { data, error } = await supabase
    .from('rooms')
    .insert<Data>([{ room_id: roomId, topic: topic }]);

  // Error handler for error inserting Room ID into 'rooms' table
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Send a success response
  console.log('Room ID inserted successfully:', data);
  return NextResponse.json({ data }, { status: 200 });
}

// Export the post function as the handler for POST requests
export { POST };
