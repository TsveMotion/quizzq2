import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PUT(
  req: Request,
  { params }: { params: { quizId: string; questionId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { quizId, questionId } = params;
    const data = await req.json();

    // Verify the quiz belongs to the student
    const quiz = await prisma.practiceQuiz.findUnique({
      where: {
        id: quizId,
        studentId: session.user.id,
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // Update the question
    const updatedQuestion = await prisma.practiceQuestion.update({
      where: {
        id: questionId,
        practiceQuizId: quizId,
      },
      data: {
        question: data.question,
        optionsJson: JSON.stringify(data.options),
        correctOption: data.correctOption,
      },
    });

    // Transform the response to include parsed options
    return NextResponse.json({
      ...updatedQuestion,
      options: JSON.parse(updatedQuestion.optionsJson),
    });
  } catch (error) {
    console.error('Error updating practice question:', error);
    return NextResponse.json(
      { error: 'Failed to update practice question' },
      { status: 500 }
    );
  }
}
