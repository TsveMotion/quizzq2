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
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { schoolId, teacherId } = params;

    // Check if the user has permission (is school admin)
    const currentUser = await prisma.user.findFirst({
      where: {
        email: session.user.email,
        role: 'SCHOOL_ADMIN',
        schoolId: schoolId,
      },
    });

    if (!currentUser) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Delete all class teacher associations
    await prisma.classTeacher.deleteMany({
      where: {
        teacherId: teacherId,
      },
    });

    // Delete all class assignments where this teacher is assigned
    await prisma.class.updateMany({
      where: {
        teacherId: teacherId,
      },
      data: {
        teacherId: null,
      },
    });

    // Delete the teacher
    await prisma.user.delete({
      where: {
        id: teacherId,
        schoolId: schoolId,
        role: 'TEACHER',
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[TEACHER_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
