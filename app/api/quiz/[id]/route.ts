import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';

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
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const quiz = await prisma.aIQuiz.findUnique({
      where: {
        id: params.id,
      },
      include: {
        questions: true,
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { answers } = await request.json();
    const quiz = await prisma.aIQuiz.findUnique({
      where: {
        id: params.id,
      },
      include: {
        questions: true,
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // Calculate score
    let score = 0;
    const totalQuestions = quiz.questions.length;
    
    for (let i = 0; i < totalQuestions; i++) {
      if (answers[i] === quiz.questions[i].correctAnswer) {
        score++;
      }
    }

    // Save attempt
    const attempt = await prisma.aIQuizAttempt.create({
      data: {
        quizId: params.id,
        userId: session.user.id,
        score: (score / totalQuestions) * 100,
        answers: {
          create: answers.map((answer: string, index: number) => ({
            questionId: quiz.questions[index].id,
            selectedAnswer: answer,
            isCorrect: answer === quiz.questions[index].correctAnswer
          }))
        },
        completedAt: new Date(),
      },
    });

    return NextResponse.json({
      score: (score / totalQuestions) * 100,
      correctAnswers: score,
      totalQuestions,
      attemptId: attempt.id,
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    return NextResponse.json(
      { error: 'Failed to submit quiz' },
      { status: 500 }
    );
  }
}
