import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { cookies } from 'next/headers';

// DELETE /api/classes/[classId]/students/[studentId] - Remove a student from a class
export async function DELETE(
  req: Request,
  { params }: { params: { classId: string; studentId: string } }
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

    // Verify the teacher owns this class
    const classRecord = await prisma.class.findUnique({
      where: {
        id: params.classId,
        teacherId: userData.userId,
      },
      include: {
        students: true,
      },
    });

    if (!classRecord) {
      return NextResponse.json(
        { error: 'Class not found or unauthorized' },
        { status: 404 }
      );
    }

    // Verify the student is in the class
    const isStudentInClass = classRecord.students.some(
      (student) => student.id === params.studentId
    );

    if (!isStudentInClass) {
      return NextResponse.json(
        { error: 'Student not found in class' },
        { status: 404 }
      );
    }

    // Remove student from class
    await prisma.class.update({
      where: { id: params.classId },
      data: {
        students: {
          disconnect: { id: params.studentId },
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to remove student:', error);
    return NextResponse.json(
      { error: 'Failed to remove student' },
      { status: 500 }
    );
  }
}
