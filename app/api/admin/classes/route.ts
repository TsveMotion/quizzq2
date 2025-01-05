import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get('schoolId');

    if (!schoolId) {
      return new NextResponse('Missing schoolId parameter', { status: 400 });
    }

    const classes = await prisma.class.findMany({
      where: {
        schoolId,
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            students: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(classes);
  } catch (error) {
    console.error('[CLASSES_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { name, description, teacherId, schoolId } = body;

    if (!name || !teacherId || !schoolId) {
      return new NextResponse('Name, teacher ID, and school ID are required', { status: 400 });
    }

    // Create the class with the primary teacher
    const newClass = await prisma.class.create({
      data: {
        name,
        description,
        school: {
          connect: { id: schoolId },
        },
        teacher: {
          connect: { id: teacherId },
        },
      },
    });

    // Add the teacher as a class teacher as well
    await prisma.classTeacher.create({
      data: {
        classId: newClass.id,
        teacherId: teacherId,
      },
    });

    // Get the created class with all its relations
    const classWithRelations = await prisma.class.findUnique({
      where: { id: newClass.id },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        classTeachers: {
          include: {
            teacher: {
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
            students: true,
            classTeachers: true,
          },
        },
      },
    });

    return NextResponse.json(classWithRelations);
  } catch (error) {
    console.error('[CLASSES_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
