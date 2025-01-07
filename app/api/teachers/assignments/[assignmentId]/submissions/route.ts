import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { assignmentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get the assignment's class
    const assignment = await prisma.assignment.findUnique({
      where: { id: params.assignmentId },
      include: {
        class: {
          include: {
            students: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!assignment) {
      return new NextResponse('Assignment not found', { status: 404 });
    }

    // Get all submissions for this assignment
    const submissions = await prisma.homeworkSubmission.findMany({
      where: {
        assignmentId: params.assignmentId,
      },
      include: {
        answers: true,
      },
    });

    // Map submissions to students
    const studentsWithSubmissions = assignment.class.students.map((student: {
      id: string;
      name: string;
      email: string;
    }) => ({
      ...student,
      submission: submissions.find((sub) => sub.studentId === student.id),
    }));

    return NextResponse.json(studentsWithSubmissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
