import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function POST(
  req: Request,
  { params }: { params: { classId: string } }
) {
  try {
    const token = cookies().get('token')?.value;
    
    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const session = await verifyAuth(token);
    
    if (!session || session.role !== 'teacher') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { studentIds } = await req.json();

    if (!studentIds || !Array.isArray(studentIds)) {
      return new NextResponse('Invalid request body', { status: 400 });
    }

    // Verify the class belongs to this teacher
    const classExists = await prisma.class.findFirst({
      where: {
        id: params.classId,
        teacherId: session.userId,
      },
    });

    if (!classExists) {
      return new NextResponse('Class not found', { status: 404 });
    }

    // Verify all students belong to this teacher
    const students = await prisma.user.findMany({
      where: {
        id: {
          in: studentIds,
        },
        role: 'student',
        createdBy: {
          id: session.userId,
        },
      },
    });

    if (students.length !== studentIds.length) {
      return new NextResponse('One or more students not found', { status: 404 });
    }

    // Update the class with the new students
    const updatedClass = await prisma.class.update({
      where: {
        id: params.classId,
      },
      data: {
        students: {
          connect: studentIds.map(id => ({ id })),
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

    return NextResponse.json(updatedClass);
  } catch (error) {
    console.error('Error adding students to class:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
