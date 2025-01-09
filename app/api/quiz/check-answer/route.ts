import { NextResponse } from 'next/server';
import { checkAnswer } from '@/lib/openai';

export async function POST(req: Request) {
  try {
    const { question, userAnswer, correctAnswer, subject, topic } = await req.json();

    // Validate input
    if (!question || !userAnswer || !correctAnswer || !subject || !topic) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check answer
    const response = await checkAnswer(
      question,
      userAnswer,
      correctAnswer,
      subject,
      topic
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error checking answer:', error);
    return NextResponse.json(
      { error: 'Failed to check answer' },
      { status: 500 }
    );
  }
}
