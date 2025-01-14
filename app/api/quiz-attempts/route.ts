import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const attempts = await prisma.aIQuizAttempt.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        quizId: true,
        score: true,
        completedAt: true,
      },
      orderBy: {
        completedAt: 'desc',
      },
    });

    return NextResponse.json(attempts);
  } catch (error) {
    console.error('Error fetching quiz attempts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz attempts' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { quizId, answers } = body;

    // Get the quiz to calculate the score
    const quiz = await prisma.aIQuiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // Calculate score
    const score = answers.reduce((acc: number, answer: any) => {
      const question = quiz.questions.find(q => q.id === answer.questionId);
      return acc + (question?.correctAnswer === answer.selectedAnswer ? 1 : 0);
    }, 0);

    // Save attempt
    const attempt = await prisma.aIQuizAttempt.create({
      data: {
        quizId,
        userId: session.user.id,
        score,
        answers: {
          create: answers.map((answer: any) => ({
            questionId: answer.questionId,
            selectedAnswer: answer.selectedAnswer,
            isCorrect: quiz.questions.find(q => q.id === answer.questionId)?.correctAnswer === answer.selectedAnswer,
          })),
        },
        completedAt: new Date(),
      },
    });

    return NextResponse.json(attempt);
  } catch (error) {
    console.error('Error saving quiz attempt:', error);
    return NextResponse.json(
      { error: 'Failed to save quiz attempt' },
      { status: 500 }
    );
  }
}
