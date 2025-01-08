import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session data:', session?.user);
    
    if (!session?.user?.id || session?.user?.role !== 'SCHOOLADMIN' || !session?.user?.schoolId) {
      return NextResponse.json(
        { error: 'Unauthorized - Requires SCHOOLADMIN role' }, 
        { status: 401 }
      );
    }

    const schoolId = session.user.schoolId;

    const teachers = await prisma.user.findMany({
      where: {
        schoolId: schoolId,
        role: 'TEACHER',
      },
      include: {
        teachingClasses: {
          include: {
            students: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            teachingClasses: true,
            students: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(teachers);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teachers' },
      { status: 500 }
    );
  }
}
