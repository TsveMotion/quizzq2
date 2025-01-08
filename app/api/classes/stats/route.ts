import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session data:', session);
    
    if (!session?.user?.email || session?.user?.role !== 'SCHOOLADMIN' || !session?.user?.schoolId) {
      return NextResponse.json(
        { error: 'Unauthorized - Requires SCHOOLADMIN role' }, 
        { status: 401 }
      );
    }

    // Get classes with their student counts and teacher info
    const classes = await prisma.class.findMany({
      where: {
        schoolId: session.user.schoolId
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
    const formattedData = classes.map((cls) => ({
      name: cls.name || 'Unnamed Class',
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
