import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { classId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const classId = params.classId;
    if (!classId) {
      return new NextResponse('Class ID is required', { status: 400 });
    }

    // Get students in the class
    const classWithStudents = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        students: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!classWithStudents) {
      return new NextResponse('Class not found', { status: 404 });
    }

    return NextResponse.json(classWithStudents.students);
  } catch (error) {
    console.error('[CLASS_STUDENTS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { classId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const classId = params.classId;
    if (!classId) {
      return new NextResponse('Class ID is required', { status: 400 });
    }

    const body = await req.json();
    const { studentId } = body;

    if (!studentId) {
      return new NextResponse('Student ID is required', { status: 400 });
    }

    // Add student to class
    const updatedClass = await prisma.class.update({
      where: { id: classId },
      data: {
        students: {
          connect: { id: studentId },
        },
      },
      include: {
        students: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(updatedClass.students);
  } catch (error) {
    console.error('[CLASS_STUDENTS_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { classId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const classId = params.classId;
    if (!classId) {
      return new NextResponse('Class ID is required', { status: 400 });
    }

    const body = await req.json();
    const { studentId } = body;

    if (!studentId) {
      return new NextResponse('Student ID is required', { status: 400 });
    }

    // Remove student from class
    const updatedClass = await prisma.class.update({
      where: { id: classId },
      data: {
        students: {
          disconnect: { id: studentId },
        },
      },
      include: {
        students: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(updatedClass.students);
  } catch (error) {
    console.error('[CLASS_STUDENTS_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
