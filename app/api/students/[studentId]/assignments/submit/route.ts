import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// POST /api/students/[studentId]/assignments/submit
export async function POST(
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

    const body = await req.json();
    const { assignmentId, answers } = body;

    if (!assignmentId || !answers) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify the assignment exists and student has access
    const assignment = await prisma.assignment.findFirst({
      where: {
        id: assignmentId,
        class: {
          students: {
            some: {
              id: params.studentId
            }
          }
        }
      },
      include: {
        questions: true
      }
    });

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    // Check if student has already submitted
    const existingSubmission = await prisma.homeworkSubmission.findUnique({
      where: {
        studentId_assignmentId: {
          studentId: params.studentId,
          assignmentId: assignmentId
        }
      }
    });

    if (existingSubmission) {
      return NextResponse.json({ error: 'Assignment already submitted' }, { status: 400 });
    }

    // Calculate score
    const score = answers.reduce((acc: number, answer: { questionId: string; selectedOption: number }) => {
      const question = assignment.questions.find(q => q.id === answer.questionId);
      if (question && question.correctAnswerIndex === answer.selectedOption) {
        return acc + 1;
      }
      return acc;
    }, 0);

    const totalScore = Math.round((score / answers.length) * 100);

    // Create submission with answers
    const submission = await prisma.homeworkSubmission.create({
      data: {
        student: {
          connect: {
            id: params.studentId
          }
        },
        assignment: {
          connect: {
            id: assignmentId
          }
        },
        grade: totalScore,
        answers: {
          create: answers.map((answer: { questionId: string; selectedOption: number }) => {
            const question = assignment.questions.find(q => q.id === answer.questionId);
            const isCorrect = question?.correctAnswerIndex === answer.selectedOption;
            
            return {
              question: {
                connect: {
                  id: answer.questionId
                }
              },
              answer: answer.selectedOption,
              isCorrect: isCorrect
            };
          })
        }
      },
      include: {
        answers: true
      }
    });

    return NextResponse.json({ 
      success: true, 
      submission: {
        id: submission.id,
        score: totalScore,
        answers: submission.answers
      }
    });
  } catch (error) {
    console.error('Failed to submit assignment:', error);
    return NextResponse.json(
      { error: 'Failed to submit assignment' },
      { status: 500 }
    );
  }
}
