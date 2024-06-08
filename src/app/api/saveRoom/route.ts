import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabaseClient';

export default async function POST(req: NextRequest) {
  console.log('Attempting to add Room ID to "rooms" table in database...');

  try {
    // Grab 'roomId', 'topic', 'description' from the parsed JSON body of the request
    const { roomId, topic, description } = await req.json();

    // Error handler for missing Room ID in request body
    if (!roomId || !topic || !description) {
      return NextResponse.json(
        { data: null, error: 'Room ID, Topic, and Description are required' },
        { status: 400 }
      );
    }

    // Store Room ID into 'rooms' table in database
    const { data, error } = await supabase
      .from('rooms')
      .insert([{ room_id: roomId, topic: topic, description: description }]);

    // Error handler for error inserting Room ID into 'rooms' table
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Send a success response
    console.log('Room ID inserted successfully:', data);
    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ data: null, error: 'Unexpected error occurred' }, { status: 500 });
  }
}

// Export the post function as the handler for POST requests
export { POST };
