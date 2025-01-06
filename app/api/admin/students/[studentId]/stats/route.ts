import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth-config';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { studentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const studentId = params.studentId;
    if (!studentId) {
      return new NextResponse('Student ID is required', { status: 400 });
    }

    // Get student's assignments
    const assignments = await prisma.homeworkSubmission.findMany({
      where: {
        studentId: studentId,
      },
      include: {
        assignment: true,
        questionSubmissions: {
          include: {
            question: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get student's practice quizzes
    const practiceQuizzes = await prisma.practiceQuiz.findMany({
      where: {
        userId: studentId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate statistics
    let totalQuestions = 0;
    let correctAnswers = 0;
    let totalTime = 0;
    
    // Process assignment submissions
    const assignmentStats = assignments.map(submission => {
      const correctCount = submission.questionSubmissions.filter(qs => qs.isCorrect).length;
      const totalCount = submission.questionSubmissions.length;
      
      totalQuestions += totalCount;
      correctAnswers += correctCount;
      
      return {
        type: 'assignment',
        title: submission.assignment.title,
        score: Math.round((correctCount / totalCount) * 100),
        date: submission.createdAt,
      };
    });

    // Process practice quizzes
    const quizStats = practiceQuizzes.map(quiz => {
      totalQuestions += quiz.totalQuestions;
      correctAnswers += quiz.correctAnswers;
      totalTime += quiz.totalTimeSeconds;
      
      return {
        type: 'quiz',
        title: 'Practice Quiz',
        score: Math.round((quiz.correctAnswers / quiz.totalQuestions) * 100),
        date: quiz.createdAt,
      };
    });

    // Combine and sort recent activity
    const recentActivity = [...assignmentStats, ...quizStats]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)
      .map(activity => ({
        ...activity,
        date: activity.date.toISOString(),
      }));

    const stats = {
      totalAssignments: assignments.length,
      completedAssignments: assignments.filter(a => a.questionSubmissions.length > 0).length,
      averageScore: assignments.length > 0
        ? Math.round(
            assignments.reduce((acc, curr) => {
              const score = (curr.questionSubmissions.filter(qs => qs.isCorrect).length / 
                           curr.questionSubmissions.length) * 100;
              return acc + score;
            }, 0) / assignments.length
          )
        : 0,
      totalQuizzes: practiceQuizzes.length,
      correctAnswers,
      totalQuestions,
      averageTimePerQuestion: totalQuestions > 0 ? Math.round(totalTime / totalQuestions) : 0,
      recentActivity,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('[STUDENT_STATS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
