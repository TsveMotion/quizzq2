import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { ROLES } from '@/lib/roles';

// GET /api/schools/[schoolId]/stats - Get statistics for a specific school
export async function GET(
  req: Request,
  { params }: { params: { schoolId: string } }
) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userData = await verifyAuth(token);
    if (!userData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the user has access to this school
    const user = await prisma.user.findUnique({
      where: { id: userData.userId },
      include: { school: true }
    });

    if (!user || user.schoolId !== params.schoolId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user counts by role
    const [students, teachers, admins] = await Promise.all([
      prisma.user.count({
        where: {
          schoolId: params.schoolId,
          role: ROLES.STUDENT
        }
      }),
      prisma.user.count({
        where: {
          schoolId: params.schoolId,
          role: ROLES.TEACHER
        }
      }),
      prisma.user.count({
        where: {
          schoolId: params.schoolId,
          role: ROLES.SCHOOLADMIN
        }
      })
    ]);

    // For now, return mock data for other stats
    // TODO: Implement real analytics when quiz functionality is added
    const stats = {
      totalStudents: students,
      totalTeachers: teachers,
      totalAdmins: admins,
      activeUsers: students + teachers + admins,
      averageQuizScore: 85, // Mock data
      quizzesTaken: 150, // Mock data
      teacherEngagement: 75, // Mock data
      studentEngagement: 80 // Mock data
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Failed to fetch school stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch school stats' },
      { status: 500 }
    );
  }
}
