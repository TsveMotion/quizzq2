import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

type RouteContext = {
  params: {
    classId: string;
  };
};

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const classId = params.classId;
    if (!classId) {
      return NextResponse.json({ error: 'Class ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
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
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if class exists
    const classExists = await prisma.class.findUnique({
      where: { id: params.classId },
    });

    if (!classExists) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    // Delete the class
    await prisma.class.delete({
      where: { id: params.classId },
    });

    return NextResponse.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Error deleting class:', error);
    return NextResponse.json(
      { error: 'Error deleting class' },
      { status: 500 }
    );
  }
}
