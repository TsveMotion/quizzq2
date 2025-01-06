import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';

// DELETE /api/schools/[schoolId]/teachers/[teacherId]
export async function DELETE(
  request: Request,
  { params }: { params: { schoolId: string; teacherId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { schoolId, teacherId } = params;

    // Check if the user has permission (is school admin or super admin)
    const currentUser = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        role: true,
        schoolId: true,
      },
    });

    if (!currentUser || 
        (currentUser.role !== 'ADMIN' && 
         (currentUser.role !== 'SCHOOLADMIN' || currentUser.schoolId !== schoolId))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Start a transaction to ensure all operations succeed or fail together
    await prisma.$transaction(async (tx) => {
      // First, delete all class teacher associations
      await tx.classTeacher.deleteMany({
        where: {
          teacherId: teacherId,
        },
      });

      // Find all classes where this teacher is the main teacher
      const classesWithTeacher = await tx.class.findMany({
        where: {
          teacherId: teacherId,
        },
        select: {
          id: true,
        },
      });

      // Delete assignments created by this teacher
      await tx.assignment.deleteMany({
        where: {
          teacherId: teacherId,
        },
      });

      // For each class, either delete it or reassign it
      if (classesWithTeacher.length > 0) {
        await tx.class.deleteMany({
          where: {
            id: {
              in: classesWithTeacher.map(c => c.id)
            }
          }
        });
      }

      // Finally, delete the teacher
      await tx.user.delete({
        where: {
          id: teacherId,
          schoolId: schoolId,
          role: 'TEACHER',
        },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[TEACHER_DELETE]', error);
    return NextResponse.json(
      { error: "Failed to delete teacher" },
      { status: 500 }
    );
  }
}

// PATCH /api/schools/[schoolId]/teachers/[teacherId]
export async function PATCH(
  request: Request,
  { params }: { params: { schoolId: string; teacherId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email } = await request.json();

    // Verify the user has permission (is school admin or super admin)
    const currentUser = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        role: true,
        schoolId: true,
      },
    });

    if (!currentUser || 
        (currentUser.role !== 'ADMIN' && 
         (currentUser.role !== 'SCHOOLADMIN' || currentUser.schoolId !== params.schoolId))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if email is already in use by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email,
        id: { not: params.teacherId },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already in use" },
        { status: 400 }
      );
    }

    // Update the teacher
    const updatedTeacher = await prisma.user.update({
      where: {
        id: params.teacherId,
        schoolId: params.schoolId,
        role: 'TEACHER',
      },
      data: {
        name,
        email,
      },
    });

    return NextResponse.json({ 
      success: true,
      teacher: updatedTeacher 
    });
  } catch (error) {
    console.error("[TEACHER_UPDATE]", error);
    return NextResponse.json(
      { error: "Failed to update teacher" },
      { status: 500 }
    );
  }
}
