import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth-config';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the user's school ID
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { schoolId: true }
    });

    if (!user?.schoolId) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }

    // Get classes with their student counts and teacher info
    const classes = await prisma.class.findMany({
      where: {
        schoolId: user.schoolId
      },
      include: {
        students: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        teacher: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            students: true,
            assignments: true
          }
        }
      }
    });

    // Format the data for the chart
    const formattedData = classes.map((cls: {
      name: string;
      _count: { students: number; assignments: number };
      teacher?: { name: string };
    }) => ({
      name: cls.name,
      studentCount: cls._count.students,
      teacherName: cls.teacher?.name || 'No Teacher',
      assignmentCount: cls._count.assignments
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error fetching class stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch class statistics' },
      { status: 500 }
    );
  }
}
