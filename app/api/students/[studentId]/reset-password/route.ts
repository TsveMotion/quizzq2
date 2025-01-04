import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

// POST /api/students/[studentId]/reset-password - Reset a student's password
export async function POST(
  req: Request,
  { params }: { params: { studentId: string } }
) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userData = await verifyAuth(token);
    if (!userData || userData.role !== 'teacher') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get teacher's school
    const teacher = await prisma.user.findUnique({
      where: { id: userData.userId },
      select: { schoolId: true },
    });

    if (!teacher?.schoolId) {
      return NextResponse.json(
        { error: 'Teacher not associated with a school' },
        { status: 400 }
      );
    }

    // Get student and verify they belong to the teacher's school
    const student = await prisma.user.findUnique({
      where: {
        id: params.studentId,
        role: 'student',
        schoolId: teacher.schoolId,
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found or unauthorized' },
        { status: 404 }
      );
    }

    const { password } = await req.json();

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update student's password
    await prisma.user.update({
      where: { id: student.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to reset password:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}
