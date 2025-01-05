import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';

const db = prisma;

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

    // Get teachers in the class through the ClassTeacher join table
    const classTeachers = await db.classTeacher.findMany({
      where: { classId },
      select: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const teachers = classTeachers.map(ct => ct.teacher);
    return NextResponse.json(teachers);
  } catch (error) {
    console.error('[CLASS_TEACHERS_GET]', error);
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
    const { teacherId } = body;

    if (!teacherId) {
      return new NextResponse('Teacher ID is required', { status: 400 });
    }

    // Check if the relationship already exists
    const existingRelation = await db.classTeacher.findFirst({
      where: {
        AND: [
          { classId: classId },
          { teacherId: teacherId }
        ]
      }
    });

    if (existingRelation) {
      return new NextResponse('Teacher is already assigned to this class', { status: 400 });
    }

    // Create the teacher-class relationship
    await db.classTeacher.create({
      data: {
        classId,
        teacherId,
      },
    });

    // Get updated list of teachers
    const classTeachers = await db.classTeacher.findMany({
      where: { classId },
      select: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const teachers = classTeachers.map(ct => ct.teacher);
    return NextResponse.json(teachers);
  } catch (error) {
    console.error('[CLASS_TEACHERS_POST]', error);
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
    const { teacherId } = body;

    if (!teacherId) {
      return new NextResponse('Teacher ID is required', { status: 400 });
    }

    // Delete the teacher-class relationship
    await db.classTeacher.deleteMany({
      where: {
        AND: [
          { classId: classId },
          { teacherId: teacherId }
        ]
      },
    });

    // Get updated list of teachers
    const classTeachers = await db.classTeacher.findMany({
      where: { classId },
      select: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const teachers = classTeachers.map(ct => ct.teacher);
    return NextResponse.json(teachers);
  } catch (error) {
    console.error('[CLASS_TEACHERS_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
