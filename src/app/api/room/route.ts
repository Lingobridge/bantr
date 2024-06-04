import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidV4 } from 'uuid';

export async function POST(req: NextRequest) {
  const roomId = uuidV4(); // Generate a unique room ID
  console.log('*** Room ID:', roomId);
  return NextResponse.json({ roomId });
}
