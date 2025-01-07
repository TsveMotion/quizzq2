import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

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
    const totalStudents = classes.reduce((acc: number, cls: { _count: { students: number } }) => 
      acc + cls._count.students, 0);
    const totalAssignments = classes.reduce((acc: number, cls: { _count: { assignments: number } }) => 
      acc + cls._count.assignments, 0);

    // Calculate performance data (last 6 assignments)
    const assignmentsWithScores = classes.flatMap((cls: {
      assignments: Array<{
        title: string;
        createdAt: Date;
        submissions: Array<{
          answers: Array<{
            isCorrect: boolean;
          }>;
        }>;
      }>;
    }) => 
      cls.assignments.map((assignment: {
        title: string;
        createdAt: Date;
        submissions: Array<{
          answers: Array<{
            isCorrect: boolean;
          }>;
        }>;
      }) => {
        const submissions = assignment.submissions;
        const averageScore = submissions.length > 0
          ? submissions.reduce((acc: number, sub: {
              answers: Array<{
                isCorrect: boolean;
              }>;
            }) => {
              const questionScores = sub.answers.map((ans: { isCorrect: boolean }) => 
                ans.isCorrect ? 1 : 0);
              const submissionScore = questionScores.length > 0
                ? (questionScores.reduce((a: number, b: number) => a + b, 0) / questionScores.length) * 100
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
    ).sort((a: { createdAt: Date }, b: { createdAt: Date }) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    )
    .slice(0, 6)
    .reverse();

    // Calculate assignment completion stats
    const now = new Date();
    const assignmentStatus = classes.flatMap((cls) => 
      cls.assignments.map(assignment => ({
        id: assignment.id,
        dueDate: assignment.dueDate || new Date(),
        submissions: assignment.submissions
      }))
    ).reduce(
      (acc: { completed: number; pending: number; overdue: number }, 
       assignment: {
         id: string;
         dueDate: Date;
         submissions: Array<any>;
       }) => {
        const dueDate = new Date(assignment.dueDate);
        const submissionCount = assignment.submissions.length;
        const expectedSubmissions = classes.find((c: {
          assignments: Array<{ id: string }>;
          students: Array<any>;
        }) => 
          c.assignments.some((a: { id: string }) => a.id === assignment.id)
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
    const classDistribution = classes.map((cls: {
      name: string;
      _count: {
        students: number;
      };
    }) => ({
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

    const formattedActivity = recentAssignments.map((assignment: {
      title: string;
      class: {
        name: string;
      };
      createdAt: Date;
    }) => ({
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
        labels: assignmentsWithScores.map((a: { title: string }) => a.title),
        data: assignmentsWithScores.map((a: { averageScore: number }) => a.averageScore),
      },
      assignmentCompletion: assignmentStatus,
      classDistribution: {
        labels: classDistribution.map((c: { name: string }) => c.name),
        data: classDistribution.map((c: { studentCount: number }) => c.studentCount),
      },
    });
  } catch (error) {
    console.error("[TEACHER_STATS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
