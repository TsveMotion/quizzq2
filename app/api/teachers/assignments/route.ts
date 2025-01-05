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

    const assignments = await prisma.assignment.findMany({
      where: {
        teacherId: teacherId,
      },
      include: {
        class: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            submissions: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(assignments);
  } catch (error) {
    console.error("[ASSIGNMENTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'TEACHER') {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { title, content, classId, dueDate } = await request.json();

    const assignment = await prisma.assignment.create({
      data: {
        title,
        content,
        dueDate: new Date(dueDate),
        teacherId: session.user.id,
        classId,
      },
      include: {
        class: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            submissions: true,
          },
        },
      },
    });

    return NextResponse.json(assignment);
  } catch (error) {
    console.error("[ASSIGNMENT_CREATE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
