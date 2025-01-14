import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  timeLimit: number;
  topic: string;
  difficulty: string;
  user: any;
}

interface Question {
  // Assuming this interface is already defined elsewhere
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: params.id },
      include: {
        questions: true,
        user: true
      }
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    const quizResponse: Quiz = {
      id: quiz.id,
      title: quiz.title,
      questions: quiz.questions,
      timeLimit: quiz.timeLimit,
      topic: quiz.topic,
      difficulty: quiz.difficulty,
      user: quiz.user
    };

    return NextResponse.json(quizResponse);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz' },
      { status: 500 }
    );
  }
}
