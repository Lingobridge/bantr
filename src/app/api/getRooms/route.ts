import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabaseClient';

// Type Definitions

// Shape for Room Data to be inserted into table
type RoomData = {
  room_id: string;
  topic: string;
};

// Shape for Data Response from Supabase after retrieval attempt
type DataResponse = {
  data: RoomData[] | null;
  error?: string; // Error property optional, if it is present, its a string
};

export default async function GET(req: NextRequest) {
  console.log('Attempting to retrieve all Rooms from "rooms" table in database...');

  try {
    // Retrieve all Rooms from 'rooms' table in database
    const { data, error } = await supabase.from('rooms').select<RoomData>('*');

    // Error handler for error retrieving Rooms from 'rooms' table
    if (error) {
      return NextResponse.json<DataResponse>({ data: null, error: error.message }, { status: 500 });
    }

    // Send a success response
    console.log('Rooms retrieved successfully:', data);
    return NextResponse.json<DataResponse>({ data }, { status: 200 });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json<DataResponse>(
      { data: null, error: 'Unexpected error occurred' },
      { status: 500 }
    );
  }
}

// Export the get function as the handler for GET requests
export { GET };
