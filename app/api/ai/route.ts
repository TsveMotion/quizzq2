import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // Special handling for creator inquiry
    if (message.toLowerCase().includes('who made you') || 
        message.toLowerCase().includes('who created you')) {
      return NextResponse.json({
        content: "I was created by QuizzQ - Kristiyan Tsvetanov. I'm an AI tutor designed to help students learn and practice effectively."
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system",
        content: "You are a helpful and knowledgeable AI tutor. Provide clear, accurate, and educational responses. Focus on explaining concepts thoroughly and providing examples when relevant."
      }, {
        role: "user",
        content: message
      }],
      temperature: 0.7,
      max_tokens: 500
    });

    return NextResponse.json({
      content: completion.choices[0].message.content
    });
  } catch (error) {
    console.error('AI API Error:', error);
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    );
  }
}
