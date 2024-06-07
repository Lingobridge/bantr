import { v2 } from '@google-cloud/translate';
import dotenv from 'dotenv';

interface TranslationPayload {
    q: string,
    source?: string,
    target: string,
    format?: string
} 

export async function POST(req: Request) {

  dotenv.config();

  const payload: TranslationPayload = await req.json();

  const translationClient = new v2.Translate({
    projectId: 	process.env.PROJECT_ID
  });
  //TODO: error handling
  const [translation] = await translationClient.translate(payload.q, payload.target);
  return Response.json({ translation });

  // try {
  //   const response = await fetch('https://translation.googleapis.com/language/translate/v2', {
  //     method: 'POST',
  //     headers,
  //     body: JSON.stringify(payload)
  //   });

  //   if (response.ok) {
  //     const data = await response.json();
  //     return NextResponse.json(data);

  //   } else {
  //     const errorData = await response.json();
  //     return NextResponse.json({ error: errorData }, { status: response.status});
  //   }
  // } catch (error) {
  //   console.error(`Error occured during google translate api request: ${error}`);
  //   return NextResponse.json({ error }, { status: 500 });
  // }
}
