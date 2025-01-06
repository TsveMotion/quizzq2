import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: { schoolId: string; studentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { schoolId, studentId } = params;
    const { name, email } = await request.json();

    // Check if the user has permission (is school admin)
    const currentUser = await prisma.user.findFirst({
      where: {
        email: session.user.email,
        role: 'SCHOOLADMIN',
        schoolId: schoolId,
      },
    });

    if (!currentUser) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: email,
          id: { not: studentId },
        },
      });

      if (existingUser) {
        return new NextResponse(
          JSON.stringify({ error: 'Email already in use' }),
          { status: 400 }
        );
      }
    }

    // Update the student
    const updatedStudent = await prisma.user.update({
      where: {
        id: studentId,
        schoolId: schoolId,
        role: 'STUDENT',
      },
      data: {
        name,
        email,
      },
    });

    return new NextResponse(JSON.stringify(updatedStudent));
  } catch (error) {
    console.error('[STUDENT_UPDATE]', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to update student' }),
      { status: 500 }
    );
  }
}

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
        role: 'SCHOOLADMIN',
        schoolId: schoolId,
      },
    });

    if (!currentUser) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Delete all related records in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete all question submissions by the student
      await tx.questionSubmission.deleteMany({
        where: {
          submission: {
            studentId: studentId
          }
        }
      });

      // Delete all homework submissions by the student
      await tx.homeworkSubmission.deleteMany({
        where: {
          studentId: studentId
        }
      });

      // Delete all practice quizzes by the student
      await tx.practiceQuiz.deleteMany({
        where: {
          userId: studentId
        }
      });

      // Delete all user activities
      await tx.userActivity.deleteMany({
        where: {
          userId: studentId
        }
      });

      // Delete the student-class relationships directly
      await tx.$executeRaw`DELETE FROM _StudentClasses WHERE B = ${studentId}`;

      // Finally, delete the student
      await tx.user.delete({
        where: {
          id: studentId,
          schoolId: schoolId,
          role: 'STUDENT',
        },
      });
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[STUDENT_DELETE]', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to delete student' }),
      { status: 500 }
    );
  }
}
