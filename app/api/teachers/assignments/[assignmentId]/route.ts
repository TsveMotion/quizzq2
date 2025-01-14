import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';

interface QuestionSubmission {
  question: {
    id: string;
    question: string;
    // ... other fields
  };
  answer: string;
  isCorrect: boolean;
}

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
        class: true,
        questions: true,
        submissions: {
          include: {
            student: true,
            answers: {
              include: {
                question: true
              }
            }
          }
        }
      }
    });

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    const submissionsWithAnswers = assignment.submissions.map(sub => ({
      id: sub.id,
      studentId: sub.student.id,
      studentName: sub.student.name,
      studentEmail: sub.student.email,
      status: sub.status,
      score: sub.score,
      submittedAt: sub.submittedAt,
      answers: sub.answers.map(ans => ({
        id: ans.id,
        questionId: ans.questionId,
        answer: ans.answer,
        score: ans.score,
        feedback: ans.feedback,
        isCorrect: ans.isCorrect
      }))
    }));

    return NextResponse.json({
      id: assignment.id,
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
      status: assignment.status,
      totalMarks: assignment.totalMarks,
      className: assignment.class.name,
      questions: assignment.questions,
      submissions: submissionsWithAnswers
    });
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
