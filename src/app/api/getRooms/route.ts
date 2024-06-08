import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabaseClient';

export async function GET(req: NextRequest) {
  console.log('Attempting to retrieve all Rooms from "rooms" table in database...');

  try {
    // Retrieve all Rooms from 'rooms' table in database
    const { data, error } = await supabase.from('rooms').select('*');

    // Error handler for error retrieving Rooms from 'rooms' table
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Send a success response
    console.log('Rooms retrieved successfully:', data);
    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ data: null, error: 'Unexpected error occurred' }, { status: 500 });
  }
}


