import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';

// GET /api/schools/[schoolId]/classes - Get all classes for a specific school    
export async function GET(
  request: Request,
  { params }: { params: { schoolId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const schoolId = params.schoolId;

    const classes = await prisma.class.findMany({
      where: {
        schoolId: schoolId,
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        students: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(classes);
  } catch (error) {
    console.error("[CLASSES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// POST /api/schools/[schoolId]/classes - Create a new class
export async function POST(
  request: Request,
  { params }: { params: { schoolId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const schoolId = params.schoolId;
    const body = await request.json();
    const { name, teacherId } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const newClass = await prisma.class.create({
      data: {
        name,
        school: {
          connect: {
            id: schoolId,
          },
        },
        ...(teacherId && {
          teacher: {
            connect: {
              id: teacherId,
            },
          },
        }),
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        students: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(newClass);
  } catch (error) {
    console.error("[CLASSES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE /api/schools/[schoolId]/classes/[classId] - Delete a class
export async function DELETE(
  request: Request,
  { params }: { params: { schoolId: string; classId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const deletedClass = await prisma.class.delete({
      where: {
        id: params.classId,
        schoolId: params.schoolId,
      },
    });

    return NextResponse.json(deletedClass);
  } catch (error) {
    console.error("Error deleting class:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
