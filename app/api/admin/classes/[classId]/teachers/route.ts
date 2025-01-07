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
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const classId = params.classId;

    const classWithTeachers = await db.class.findUnique({
      where: { id: classId },
      include: {
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
      },
    });

    if (!classWithTeachers) {
      return new NextResponse("Class not found", { status: 404 });
    }

    return NextResponse.json(classWithTeachers.classTeachers);
  } catch (error) {
    console.error("[CLASS_TEACHERS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { classId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const classId = params.classId;
    const { teacherId } = await req.json();

    const updatedClass = await db.class.update({
      where: { id: classId },
      data: {
        classTeachers: {
          create: {
            teacherId: teacherId,
          },
        },
      },
      include: {
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
      },
    });

    return NextResponse.json(updatedClass.classTeachers);
  } catch (error) {
    console.error("[CLASS_TEACHERS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { classId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const classId = params.classId;
    const { teacherId } = await req.json();

    // Update class
    const updatedClass = await prisma.class.update({
      where: {
        id: params.classId,
      },
      data: {
        classTeachers: {
          deleteMany: {
            AND: [
              { teacherId: teacherId },
              { classId: params.classId }
            ]
          }
        }
      },
      include: {
        classTeachers: {
          include: {
            teacher: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        }
      }
    });

    return NextResponse.json(updatedClass.classTeachers);
  } catch (error) {
    console.error("[CLASS_TEACHERS_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
