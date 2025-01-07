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

    const { submissionId, feedback } = await req.json();

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

    // Grade each answer
    const gradedAnswers = submission.answers.map(answer => {
      const isCorrect = String(answer.answer) === String(answer.question.correctAnswer);
      const score = isCorrect ? answer.question.points : 0;
      return {
        ...answer,
        isCorrect,
        score
      };
    });

    // Calculate total grade
    const totalPoints = submission.answers.reduce((sum, answer) => sum + answer.question.points, 0);
    const earnedPoints = gradedAnswers.reduce((sum, answer) => sum + answer.score, 0);
    const finalGrade = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;

    // Update submission grades
    await prisma.$transaction(async (tx) => {
      // Update each answer
      for (const answer of gradedAnswers) {
        await tx.questionSubmission.update({
          where: { id: answer.id },
          data: {
            isCorrect: answer.isCorrect,
            score: answer.score
          }
        });
      }

      // Update homework submission
      await tx.homeworkSubmission.update({
        where: { id: submissionId },
        data: {
          grade: finalGrade,
          feedback,
          status: 'GRADED'
        }
      });
    });

    return NextResponse.json({ message: 'Submission graded successfully' });
  } catch (error) {
    console.error('Error grading submission:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
