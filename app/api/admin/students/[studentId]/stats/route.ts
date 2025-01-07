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
    const assignments = await prisma.assignment.findMany({
      where: {
        class: {
          students: {
            some: {
              id: studentId
            }
          }
        }
      },
      include: {
        questions: true,
        submissions: {
          where: {
            studentId: studentId
          },
          include: {
            student: true,
            answers: true
          }
        }
      }
    });

    // Get student's practice quizzes
    const practiceQuizzes = await prisma.practiceQuiz.findMany({
      where: {
        userId: studentId
      },
      select: {
        id: true,
        title: true,
        type: true,
        questions: true,
        createdAt: true
      }
    });

    // Calculate statistics
    let totalQuestions = 0;
    let correctAnswers = 0;
    let totalTime = 0;
    
    // Process assignment submissions
    const assignmentStats = assignments.map((assignment: any) => {
      const submission = assignment.submissions[0];
      const correctCount = submission.answers.filter((answer: { isCorrect: boolean }) => answer.isCorrect).length;
      const totalCount = submission.answers.length;
      
      totalQuestions += totalCount;
      correctAnswers += correctCount;
      
      return {
        type: 'assignment',
        title: assignment.title,
        score: Math.round((correctCount / totalCount) * 100),
        date: submission.submittedAt,
      };
    });

    // Process practice quizzes
    const quizStats = practiceQuizzes.map((quiz: any) => {
      totalQuestions += quiz.questions.length;
      correctAnswers += quiz.questions.filter((question: any) => question.correctAnswer).length;
      totalTime += 0; // No time data available in the new query
      
      return {
        type: 'quiz',
        title: quiz.title,
        score: Math.round((quiz.questions.filter((question: any) => question.correctAnswer).length / quiz.questions.length) * 100),
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
      completedAssignments: assignments.filter((a: any) => a.submissions.length > 0).length,
      averageScore: assignments.length > 0
        ? Math.round(
            assignments.reduce((acc: number, curr: any) => {
              const submission = curr.submissions[0];
              const score = (submission.answers.filter((answer: { isCorrect: boolean }) => answer.isCorrect).length / 
                           submission.answers.length) * 100;
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
