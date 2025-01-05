import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(
  req: Request,
  { params }: { params: { teacherId: string; studentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.id !== params.teacherId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { newPassword } = await req.json();

    if (!newPassword) {
      return NextResponse.json(
        { error: 'New password is required' },
        { status: 400 }
      );
    }

    // Get teacher's school
    const teacher = await prisma.user.findUnique({
      where: { id: params.teacherId },
      select: { schoolId: true }
    });

    // Get student and verify they belong to teacher's school
    const student = await prisma.user.findUnique({
      where: { id: params.studentId },
      select: { schoolId: true }
    });

    if (!teacher?.schoolId || !student || student.schoolId !== teacher.schoolId) {
      return NextResponse.json(
        { error: 'Student not found or not in your school' },
        { status: 404 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update student's password
    await prisma.user.update({
      where: { id: params.studentId },
      data: { password: hashedPassword }
    });

    return NextResponse.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}
