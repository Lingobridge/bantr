import { v2 } from '@google-cloud/translate';
import dotenv from 'dotenv';
import { NextRequest, NextResponse } from 'next/server';

interface TranslationPayload {
    q: string,
    source?: string,
    target: string,
    format?: string
} 

dotenv.config();

export async function POST(req: NextRequest) {
  const payload: TranslationPayload = await req.json();

  const translationClient = new v2.Translate({
    projectId: 	process.env.PROJECT_ID
  });
  
  try {
    const [translation] = await translationClient.translate(payload.q, payload.target);
    return NextResponse.json({ translation });
  } catch (error) {
    console.error(`${error}`);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
