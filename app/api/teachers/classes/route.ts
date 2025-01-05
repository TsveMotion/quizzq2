import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'TEACHER') {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const teacherId = session.user.id;

    const classes = await prisma.class.findMany({
      where: {
        teacherId: teacherId,
      },
      include: {
        school: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            students: true,
            assignments: true,
          },
        },
      },
    });

    return NextResponse.json(classes);
  } catch (error) {
    console.error("[TEACHER_CLASSES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
