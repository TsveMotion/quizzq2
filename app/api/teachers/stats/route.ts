import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'TEACHER') {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const teacherId = session.user.id;

    // Get teacher's classes with counts and student performance
    const classes = await prisma.class.findMany({
      where: {
        teacherId: teacherId,
      },
      include: {
        _count: {
          select: {
            students: true,
            assignments: true,
          },
        },
        students: true,
        assignments: {
          include: {
            submissions: {
              include: {
                answers: {
                  include: {
                    question: true
                  }
                }
              }
            },
          },
        },
      },
    });

    // Calculate totals
    const totalStudents = classes.reduce((acc, cls) => acc + cls._count.students, 0);
    const totalAssignments = classes.reduce((acc, cls) => acc + cls._count.assignments, 0);

    // Calculate performance data (last 6 assignments)
    const assignmentsWithScores = classes.flatMap(cls => 
      cls.assignments.map(assignment => {
        const submissions = assignment.submissions;
        const averageScore = submissions.length > 0
          ? submissions.reduce((acc, sub) => {
              const questionScores = sub.answers.map(ans => ans.isCorrect ? 1 : 0);
              const submissionScore = questionScores.length > 0
                ? (questionScores.reduce((a, b) => a + b, 0) / questionScores.length) * 100
                : 0;
              return acc + submissionScore;
            }, 0) / submissions.length
          : 0;
        return {
          title: assignment.title,
          averageScore,
          createdAt: assignment.createdAt,
        };
      })
    ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 6)
    .reverse();

    // Calculate assignment completion stats
    const now = new Date();
    const assignmentStatus = classes.flatMap(cls => cls.assignments).reduce(
      (acc, assignment) => {
        const dueDate = new Date(assignment.dueDate);
        const submissionCount = assignment.submissions.length;
        const expectedSubmissions = classes.find(c => 
          c.assignments.some(a => a.id === assignment.id)
        )?.students.length || 0;
        
        if (submissionCount >= expectedSubmissions) {
          acc.completed++;
        } else if (dueDate < now) {
          acc.overdue++;
        } else {
          acc.pending++;
        }
        return acc;
      },
      { completed: 0, pending: 0, overdue: 0 }
    );

    // Calculate class distribution
    const classDistribution = classes.map(cls => ({
      name: cls.name,
      studentCount: cls._count.students,
    }));

    // Get recent activity (last 5 assignments)
    const recentAssignments = await prisma.assignment.findMany({
      where: {
        teacherId: teacherId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
      include: {
        class: true,
      },
    });

    const formattedActivity = recentAssignments.map(assignment => ({
      type: 'Assignment Created',
      description: `Created "${assignment.title}" for ${assignment.class.name}`,
      date: format(assignment.createdAt, 'MMM d, yyyy'),
    }));

    return NextResponse.json({
      totalStudents,
      totalClasses: classes.length,
      totalAssignments,
      recentActivity: formattedActivity,
      performanceData: {
        labels: assignmentsWithScores.map(a => a.title),
        data: assignmentsWithScores.map(a => a.averageScore),
      },
      assignmentCompletion: assignmentStatus,
      classDistribution: {
        labels: classDistribution.map(c => c.name),
        data: classDistribution.map(c => c.studentCount),
      },
    });
  } catch (error) {
    console.error("[TEACHER_STATS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
