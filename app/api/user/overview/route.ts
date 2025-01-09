import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's quiz attempts and stats
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        quizSubmissions: {
          include: {
            quiz: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5 // Get last 5 attempts
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate stats
    const quizSubmissions = user.quizSubmissions || [];
    const totalQuizzes = quizSubmissions.length;
    const totalScore = quizSubmissions.reduce((sum: number, attempt: { score: number }) => sum + (attempt.score || 0), 0);
    const totalTimeSpent = quizSubmissions.reduce((sum: number, attempt: { timeTaken: number }) => {
      return sum + (attempt.timeTaken || 0);
    }, 0);
    const successfulAttempts = quizSubmissions.filter((attempt: { score: number }) => 
      attempt.score && attempt.score >= 70
    ).length;
    const successRate = totalQuizzes > 0 ? Math.round((successfulAttempts / totalQuizzes) * 100) : 0;

    // Format recent activity
    const recentActivity = quizSubmissions.map((attempt: { id: string; quiz: { title: string }; score: number; completedAt: Date }) => ({
      id: attempt.id,
      quizTitle: attempt.quiz.title,
      score: attempt.score,
      completedAt: attempt.completedAt
    }));

    return NextResponse.json({
      stats: {
        totalQuizzes,
        successRate,
        timeSpent: Math.floor(totalTimeSpent / 3600), // Convert to hours
        totalScore
      },
      recentActivity
    });
  } catch (error) {
    console.error('Error fetching user overview:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user overview' },
      { status: 500 }
    );
  }
}
