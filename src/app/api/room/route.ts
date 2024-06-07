import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidV4 } from 'uuid';

export async function POST(req: NextRequest) {
  console.log('Attempting to generate unique Room ID...');

  // Generate a unique room ID
  const roomId = uuidV4();

  // Send a success response
  console.log('*** Room ID:', roomId);
  return NextResponse.json({ roomId });
}
