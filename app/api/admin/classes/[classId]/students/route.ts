import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { classId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const classId = params.classId;

    const classWithStudents = await prisma.class.findUnique({
      where: {
        id: classId,
      },
      include: {
        students: true,
      },
    });

    if (!classWithStudents) {
      return new NextResponse("Class not found", { status: 404 });
    }

    return NextResponse.json(classWithStudents.students);
  } catch (error) {
    console.error("[CLASS_STUDENTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { classId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const classId = params.classId;
    const { studentId } = await request.json();

    const updatedClass = await prisma.class.update({
      where: {
        id: classId,
      },
      data: {
        students: {
          connect: {
            id: studentId,
          },
        },
      },
      include: {
        students: true,
      },
    });

    return NextResponse.json(updatedClass.students);
  } catch (error) {
    console.error("[CLASS_STUDENTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { classId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const classId = params.classId;
    const { studentId } = await request.json();

    const updatedClass = await prisma.class.update({
      where: {
        id: classId,
      },
      data: {
        students: {
          disconnect: {
            id: studentId,
          },
        },
      },
      include: {
        students: true,
      },
    });

    return NextResponse.json(updatedClass.students);
  } catch (error) {
    console.error("[CLASS_STUDENTS_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
