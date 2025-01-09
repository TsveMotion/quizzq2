import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const MAX_TOKENS = 1000;

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    const { question, answer, type } = await req.json();

    if (!question || !answer) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const prompt = `You are a helpful and encouraging ${type} tutor. The student was given this question: "${question}"

Their answer was: "${answer}"

Provide detailed feedback that:
1. Evaluates if the answer is correct
2. Explains why it's correct or what mistakes were made
3. Gives helpful tips for similar problems
4. Uses an encouraging tone

Keep the response concise but informative.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert mathematics tutor who provides helpful and encouraging feedback to students."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: session ? undefined : MAX_TOKENS,
      temperature: 0.7,
    });

    const feedback = completion.choices[0]?.message?.content;
    if (!feedback) {
      throw new Error('No feedback from OpenAI');
    }

    return NextResponse.json({
      success: true,
      feedback
    });
  } catch (error: any) {
    console.error('Error generating feedback:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate feedback' },
      { status: 500 }
    );
  }
}
