import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { schoolId: string; studentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { schoolId, studentId } = params;

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

    // Delete all class associations (_StudentClasses)
    await prisma.$executeRaw`DELETE FROM _StudentClasses WHERE B = ${studentId}`;

    // Delete the student
    await prisma.user.delete({
      where: {
        id: studentId,
        schoolId: schoolId,
        role: 'STUDENT',
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[STUDENT_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
