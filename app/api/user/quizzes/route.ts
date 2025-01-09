import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get all published quizzes with their questions
    const quizzes = await prisma.quiz.findMany({
      where: {
        published: true,
        OR: [
          { isPremium: false },
          { isPremium: true }
        ]
      },
      include: {
        questions: {
          select: {
            id: true,
            question: true,
            options: true,
            order: true
          }
        },
        submissions: {
          where: {
            userId: user.id
          },
          select: {
            id: true,
            score: true,
            completedAt: true
          }
        }
      }
    });

    // Type the submissions array properly
    const quizzesWithStats = quizzes.map((quiz: any) => {
      const submissions = quiz.submissions || [];
      return {
        ...quiz,
        attempts: submissions.length,
        averageScore: submissions.length > 0 
          ? submissions.reduce((a: number, b: { score: number }) => a + (b.score || 0), 0) / submissions.length 
          : 0,
        questions: quiz.questions.map((q: any) => ({
          ...q,
          correctAnswer: undefined // Hide correct answer
        }))
      };
    });

    return NextResponse.json(quizzesWithStats);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quizzes' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { quizId, answers } = await req.json();

    if (!quizId || !answers) {
      return NextResponse.json(
        { error: 'Quiz ID and answers are required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create quiz submission
    const submission = await prisma.quizSubmission.create({
      data: {
        quizId,
        userId: user.id,
        completedAt: new Date(),
        answers: {
          create: answers.map((answer: any) => ({
            questionId: answer.questionId,
            answer: answer.answer,
            isCorrect: answer.isCorrect
          }))
        }
      },
      include: {
        answers: true
      }
    });

    // Calculate score
    const totalCorrect = submission.answers.filter(a => a.isCorrect).length;
    const score = (totalCorrect / answers.length) * 100;

    // Update submission with score
    await prisma.quizSubmission.update({
      where: { id: submission.id },
      data: { score }
    });

    return NextResponse.json({
      submissionId: submission.id,
      score,
      totalCorrect,
      totalQuestions: answers.length
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    return NextResponse.json(
      { error: 'Failed to submit quiz' },
      { status: 500 }
    );
  }
}
