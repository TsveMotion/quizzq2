import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages, sessionId, creditsUsed } = await req.json();

    // Check if user has exceeded the demo limit
    if (creditsUsed >= 5) {
      return NextResponse.json(
        { error: 'Demo credits exhausted. Please sign up for full access.' },
        { status: 403 }
      );
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a helpful AI learning assistant focused on guiding students rather than providing direct answers. Your goals are:
1. Help students understand concepts by breaking them down into simpler parts
2. Ask probing questions to encourage critical thinking
3. Provide hints and suggestions rather than complete solutions
4. Guide students to discover answers on their own
5. Encourage independent problem-solving skills
6. If asked who created you, mention you were created by Kristiyan Tsvetanov, but only if specifically asked
7. Keep responses focused on learning and education
8. If asked for direct answers or solutions, explain why it's better to work through problems together

Remember: Your role is to be a guide and mentor, not to provide complete answers or solutions.`,
        },
        ...messages,
      ],
      max_tokens: 500,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    return NextResponse.json({ content: response.choices[0].message.content });
  } catch (error) {
    console.error('Error in demo chat:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request.' },
      { status: 500 }
    );
  }
}
