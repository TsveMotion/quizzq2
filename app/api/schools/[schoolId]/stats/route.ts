import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/schools/[schoolId]/stats - Get statistics for a specific school
export async function GET(
  req: Request,
  { params }: { params: { schoolId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the user has access to this school
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { school: true }
    });

    if (!user || user.schoolId !== params.schoolId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user counts by role
    const userCounts = await prisma.user.groupBy({
      by: ['role'],
      where: {
        schoolId: params.schoolId,
      },
      _count: {
        _all: true,
      },
    });

    // Get active users (users who have submitted in the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activeUsers = await prisma.user.count({
      where: {
        schoolId: params.schoolId,
        submissions: {
          some: {
            createdAt: {
              gte: thirtyDaysAgo,
            },
          },
        },
      },
    });

    // Get total submissions
    const totalSubmissions = await prisma.homeworkSubmission.count({
      where: {
        student: {
          schoolId: params.schoolId,
        },
      },
    });

    // Calculate stats
    const stats = {
      totalStudents: userCounts.find((c: { role: string; _count: { _all: number } }) => c.role === 'student')?._count._all || 0,
      totalTeachers: userCounts.find((c: { role: string; _count: { _all: number } }) => c.role === 'teacher')?._count._all || 0,
      totalAdmins: userCounts.find((c: { role: string; _count: { _all: number } }) => c.role === 'schooladmin')?._count._all || 0,
      activeUsers,
      totalSubmissions
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching school stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch school statistics' },
      { status: 500 }
    );
  }
}
