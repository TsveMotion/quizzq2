import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { submissionId, grade, feedback } = await req.json();

    // Validate the submission exists and belongs to a class where the user is a teacher
    const submission = await prisma.homeworkSubmission.findFirst({
      where: {
        id: submissionId,
        assignment: {
          teacherId: session.user.id
        }
      },
      include: {
        answers: {
          include: {
            question: true
          }
        }
      }
    });

    if (!submission) {
      return new NextResponse('Submission not found', { status: 404 });
    }

    // Update submissions with grades
    const updatePromises = submission.answers.map(answer => {
      const isCorrect = String(answer.answer) === String(answer.question.correctAnswerIndex);
      const score = isCorrect ? answer.question.marks : 0;

      return prisma.questionSubmission.update({
        where: { id: answer.id },
        data: {
          isCorrect,
          score,
          submittedAt: new Date(),
        },
      });
    });

    await Promise.all(updatePromises);

    // Update the submission with grade and feedback
    const updatedSubmission = await prisma.homeworkSubmission.update({
      where: {
        id: submissionId
      },
      data: {
        grade,
        feedback,
        status: 'graded'
      }
    });

    return NextResponse.json(updatedSubmission);
  } catch (error) {
    console.error('Error grading submission:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
