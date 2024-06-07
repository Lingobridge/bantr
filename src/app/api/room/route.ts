import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidV4 } from 'uuid';

export async function POST(req: NextRequest) {
  const roomId = uuidV4().replace(/-/g, '').substring(0, 12); // Generate a unique room ID
  return NextResponse.json({ roomId });
}
