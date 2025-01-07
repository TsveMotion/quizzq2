import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: Request,
  { params }: { params: { schoolId: string; classId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, description } = await req.json();

    // Validate input
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    // Check if class exists and belongs to the school
    const existingClass = await prisma.class.findFirst({
      where: {
        id: params.classId,
        schoolId: params.schoolId,
      },
    });

    if (!existingClass) {
      return new NextResponse("Class not found", { status: 404 });
    }

    // Update class
    const updatedClass = await prisma.class.update({
      where: {
        id: params.classId,
      },
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(updatedClass);
  } catch (error) {
    console.error("[CLASS_UPDATE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { schoolId: string; classId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if class exists and belongs to the school
    const existingClass = await prisma.class.findFirst({
      where: {
        id: params.classId,
        schoolId: params.schoolId,
      },
    });

    if (!existingClass) {
      return new NextResponse("Class not found", { status: 404 });
    }

    // Delete class and all related records
    await prisma.$transaction(async (tx) => {
      // Delete class assignments
      await tx.assignment.deleteMany({
        where: {
          classId: params.classId,
        },
      });

      // Delete class teachers
      await tx.classTeacher.deleteMany({
        where: {
          classId: params.classId,
        },
      });

      // Delete student-class relationships using the raw SQL approach
      await tx.$executeRaw`DELETE FROM _StudentClasses WHERE A = ${params.classId}`;

      // Finally, delete the class itself
      await tx.class.delete({
        where: {
          id: params.classId,
        },
      });
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[CLASS_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
