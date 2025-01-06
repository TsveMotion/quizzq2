import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { schoolId: string; classId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { schoolId, classId } = params;

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

    // Delete all class teachers associations
    await prisma.classTeacher.deleteMany({
      where: {
        classId: classId,
      },
    });

    // Delete all student associations (_StudentClasses)
    await prisma.$executeRaw`DELETE FROM _StudentClasses WHERE A = ${classId}`;

    // Delete the class
    await prisma.class.delete({
      where: {
        id: classId,
        schoolId: schoolId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[CLASS_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
