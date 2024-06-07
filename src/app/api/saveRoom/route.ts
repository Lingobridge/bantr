import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabaseClient';

// Type Definitions

// Shape for Room Data to be inserted into table
type RoomData = {
  room_id: string;
  topic: string;
};

// Shape for Data Response from Supabase after insertion attempt
type DataResponse = {
  data: RoomData[] | null;
  error?: string; // Error property optional, if it is present, its a string
};

export default async function POST(req: NextRequest) {
  console.log('Attempting to add Room ID to "rooms" table in database...');

  try {
    // Grab 'roomId' from the parsed JSON body of the request
    const { roomId, topic }: { roomId: string; topic: string } = await req.json();

    // Error handler for missing Room ID in request body
    if (!roomId) {
      return NextResponse.json<DataResponse>(
        { data: null, error: 'Room ID & Topic are required' },
        { status: 400 }
      );
    }

    // Store Room ID into 'rooms' table in database
    const { data, error } = await supabase
      .from('rooms')
      .insert([{ room_id: roomId, topic: topic }]);

    // Error handler for error inserting Room ID into 'rooms' table
    if (error) {
      return NextResponse.json<DataResponse>({ data: null, error: error.message }, { status: 500 });
    }

    // Send a success response
    console.log('Room ID inserted successfully:', data);
    return NextResponse.json<DataResponse>({ data }, { status: 200 });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json<DataResponse>(
      { data: null, error: 'Unexpected error occurred' },
      { status: 500 }
    );
  }
}

// Export the post function as the handler for POST requests
export { POST };
