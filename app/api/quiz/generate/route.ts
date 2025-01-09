import { NextResponse } from 'next/server';
import { generateQuiz } from '@/lib/openai';

export async function POST(req: Request) {
  try {
    const { subject, topics, numQuestions, difficulty } = await req.json();

    // Validate input
    if (!subject || !topics || !numQuestions || !difficulty) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (topics.length === 0) {
      return NextResponse.json(
        { error: 'At least one topic must be selected' },
        { status: 400 }
      );
    }

    // Generate quiz
    const quiz = await generateQuiz(subject, topics, numQuestions, difficulty);

    return NextResponse.json({ quiz });
  } catch (error) {
    console.error('Error in quiz generation:', error);
    return NextResponse.json(
      { error: 'Failed to generate quiz' },
      { status: 500 }
    );
  }
}
