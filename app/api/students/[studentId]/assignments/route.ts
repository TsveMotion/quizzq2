import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/students/[studentId]/assignments
export async function GET(
  req: Request,
  { params }: { params: { studentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the student has access
    if (session.user.id !== params.studentId && session.user.role !== 'student') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get assignments for the student's class
    const assignments = await prisma.assignment.findMany({
      where: {
        class: {
          students: {
            some: {
              id: params.studentId
            }
          }
        }
      },
      include: {
        class: {
          select: {
            id: true,
            name: true,
          }
        },
        questions: {
          select: {
            id: true,
            question: true,
            options: true,
            correctAnswerIndex: true,
            explanation: true,
          }
        },
        submissions: {
          where: {
            studentId: params.studentId
          },
          include: {
            answers: true
          }
        }
      },
      orderBy: {
        dueDate: 'asc'
      }
    });

    // Format the response
    const formattedAssignments = assignments.map(assignment => {
      const submission = assignment.submissions[0]; // Get student's submission
      const totalQuestions = assignment.questions.length;
      let score = 0;

      if (submission) {
        const correctAnswers = submission.answers.filter(answer => 
          answer.selectedOption === assignment.questions.find(q => q.id === answer.questionId)?.correctAnswerIndex
        ).length;
        score = Math.round((correctAnswers / totalQuestions) * 100);
      }

      return {
        id: assignment.id,
        title: assignment.title,
        subject: assignment.subject,
        dueDate: assignment.dueDate,
        class: {
          id: assignment.class.id,
          name: assignment.class.name,
        },
        questions: assignment.questions.map(q => ({
          id: q.id,
          question: q.question,
          options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
          correctAnswerIndex: submission ? q.correctAnswerIndex : undefined, // Only show correct answer if submitted
          explanation: submission ? q.explanation : undefined, // Only show explanation if submitted
          selectedOption: submission?.answers.find(a => a.questionId === q.id)?.selectedOption
        })),
        status: {
          submitted: !!submission,
          score: submission ? score : undefined,
          submittedAt: submission?.createdAt
        }
      };
    });

    return NextResponse.json(formattedAssignments);
  } catch (error) {
    console.error('Failed to fetch assignments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assignments' },
      { status: 500 }
    );
  }
}
