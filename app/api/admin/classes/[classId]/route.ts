import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
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
    const { name, description } = body;

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    const updatedClass = await prisma.class.update({
      where: { id: classId },
      data: {
        name,
        description,
      },
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

    return NextResponse.json(updatedClass);
  } catch (error) {
    console.error('[CLASS_UPDATE]', error);
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

    // Delete class
    await prisma.class.delete({
      where: { id: classId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[CLASS_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
