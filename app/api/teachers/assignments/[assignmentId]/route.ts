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

    const assignment = await prisma.assignment.findUnique({
      where: { id: params.assignmentId },
      include: {
        class: {
          select: {
            id: true,
            name: true
          }
        },
        questions: {
          select: {
            id: true,
            text: true,
            type: true,
            options: true,
            points: true,
            marks: true,
            correctAnswer: true,
            correctAnswerIndex: true
          }
        },
        submissions: {
          select: {
            id: true,
            status: true,
            grade: true,
            submittedAt: true,
            student: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            answers: {
              select: {
                id: true,
                answer: true,
                isCorrect: true,
                score: true,
                question: {
                  select: {
                    id: true,
                    text: true,
                    type: true,
                    points: true,
                    marks: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!assignment) {
      return new NextResponse('Assignment not found', { status: 404 });
    }

    // Format the response
    const formattedAssignment = {
      id: assignment.id,
      title: assignment.title,
      description: assignment.description || '',
      dueDate: assignment.dueDate,
      className: assignment.class.name,
      questions: assignment.questions,
      submissions: assignment.submissions.map((sub) => ({
        id: sub.id,
        studentId: sub.student.id,
        studentName: sub.student.name,
        studentEmail: sub.student.email,
        grade: sub.grade,
        status: sub.status,
        submittedAt: sub.submittedAt,
        answers: sub.answers.map(ans => ({
          id: ans.id,
          questionId: ans.question.id,
          answer: ans.answer,
          isCorrect: ans.isCorrect,
          score: ans.score
        }))
      })),
    };

    return NextResponse.json(formattedAssignment);
  } catch (error) {
    console.error('Error fetching assignment:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { assignmentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'TEACHER') {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const teacherId = session.user.id;
    const assignmentId = params.assignmentId;

    // First verify the teacher owns this assignment
    const assignment = await prisma.assignment.findUnique({
      where: {
        id: assignmentId,
        teacherId: teacherId,
      },
    });

    if (!assignment) {
      return new NextResponse("Assignment not found", { status: 404 });
    }

    // Delete the assignment and all related data (submissions, attachments)
    await prisma.assignment.delete({
      where: {
        id: assignmentId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[ASSIGNMENT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
