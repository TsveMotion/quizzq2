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

    // Get teacher's classes with counts
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
      },
    });

    // Calculate totals
    const totalStudents = classes.reduce((acc, cls) => acc + cls._count.students, 0);
    const totalAssignments = classes.reduce((acc, cls) => acc + cls._count.assignments, 0);

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
    });
  } catch (error) {
    console.error("[TEACHER_STATS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
