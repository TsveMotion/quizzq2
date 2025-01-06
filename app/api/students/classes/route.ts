import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      include: {
        enrolledClasses: {
          include: {
            teacher: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    const classes = user.enrolledClasses.map((classItem) => ({
      id: classItem.id,
      name: classItem.name,
      description: classItem.description || '',
      teacherName: classItem.teacher?.name || 'Unknown Teacher',
      schedule: classItem.schedule || 'Schedule not set',
    }));

    return NextResponse.json(classes);
  } catch (error) {
    console.error('Error fetching student classes:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
