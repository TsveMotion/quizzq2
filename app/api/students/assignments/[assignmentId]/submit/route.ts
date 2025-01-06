import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { assignmentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const formData = await request.formData();
    const content = formData.get('content') as string;
    const answersJson = formData.get('answers') as string;
    const answers = JSON.parse(answersJson);

    // Create the submission
    const submission = await prisma.homeworkSubmission.create({
      data: {
        content,
        status: 'submitted',
        studentId: session.user.id,
        assignmentId: params.assignmentId,
        files: '[]', // Initialize with empty array
      },
    });

    // Create question submissions
    const questionSubmissions = await Promise.all(
      Object.entries(answers).map(async ([questionId, answer]) => {
        // Get the question to check if the answer is correct
        const question = await prisma.quizQuestion.findUnique({
          where: { id: questionId },
        });

        return prisma.questionSubmission.create({
          data: {
            questionId,
            submissionId: submission.id,
            answer: answer as number,
            isCorrect: question?.correctAnswerIndex === answer,
          },
        });
      })
    );

    // Return the submission with its answers
    return NextResponse.json({
      ...submission,
      answers: questionSubmissions,
    });
  } catch (error) {
    console.error('Error submitting assignment:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
