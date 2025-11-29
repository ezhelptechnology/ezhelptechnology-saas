// app/api/test-groq/route.ts
import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function GET() {
  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: 'Say "Groq is working perfectly!" in a excited way.',
        },
      ],
      model: 'llama-3.1-8b-instant',
    });

    return NextResponse.json({
      success: true,
      message: chatCompletion.choices[0]?.message?.content || '',
      model: 'llama-3.1-8b-instant',
      provider: 'Groq'
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}