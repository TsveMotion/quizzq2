import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const classes = await prisma.class.findMany({
      where: {
        students: {
          some: {
            id: session.user.id
          }
        }
      },
      select: {
        id: true,
        name: true,
        description: true,
        teacher: {
          select: {
            name: true
          }
        }
      }
    });

    const transformedClasses = classes.map(classItem => ({
      id: classItem.id,
      name: classItem.name,
      description: classItem.description,
      teacherName: classItem.teacher?.name || 'No teacher assigned'
    }));

    return NextResponse.json(transformedClasses);
  } catch (error) {
    console.error('Error fetching student classes:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
