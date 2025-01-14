import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the latest attempt for this quiz by the user
    const attempt = await prisma.aIQuizAttempt.findFirst({
      where: {
        quizId: params.id,
        userId: session.user.id,
      },
      orderBy: {
        completedAt: 'desc',
      },
      include: {
        quiz: {
          include: {
            questions: true,
          }
        },
        answers: true,
      },
    });

    if (!attempt) {
      return NextResponse.json({ error: 'Quiz attempt not found' }, { status: 404 });
    }

    // Format the results
    const formattedResults = {
      quizId: attempt.quizId,
      score: attempt.score,
      completedAt: attempt.completedAt,
      totalQuestions: attempt.quiz.questions.length,
      correctAnswers: attempt.answers.filter(a => a.isCorrect).length,
      questions: attempt.quiz.questions.map(question => {
        const userAnswer = attempt.answers.find(a => a.questionId === question.id);
        return {
          question: question.question,
          correctAnswer: question.correctAnswer,
          userAnswer: userAnswer?.selectedAnswer || '',
          isCorrect: userAnswer?.isCorrect || false,
          explanation: question.explanation,
        };
      }),
    };

    return NextResponse.json(formattedResults);
  } catch (error) {
    console.error('Error fetching quiz result:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz result' },
      { status: 500 }
    );
  }
}
