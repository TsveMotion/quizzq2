import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { subject, topic, questions } = await req.json();

    // Create a new practice quiz with the AI-generated questions
    const practiceQuiz = await prisma.practiceQuiz.create({
      data: {
        subject,
        topic,
        studentId: session.user.id,
        questions: {
          create: questions.map((q: any) => ({
            question: q.question,
            optionsJson: JSON.stringify(q.options),
            correctOption: q.correctOption,
          }))
        }
      },
      include: {
        questions: true,
      },
    });

    // Transform the response to include parsed options
    return NextResponse.json({
      ...practiceQuiz,
      questions: practiceQuiz.questions.map(q => ({
        ...q,
        options: JSON.parse(q.optionsJson),
      })),
    });
  } catch (error) {
    console.error('Error creating practice quiz:', error);
    return NextResponse.json(
      { error: 'Failed to create practice quiz' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all practice quizzes for the student
    const practiceQuizzes = await prisma.practiceQuiz.findMany({
      where: {
        studentId: session.user.id,
      },
      include: {
        questions: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform the response to include parsed options
    return NextResponse.json(
      practiceQuizzes.map(quiz => ({
        ...quiz,
        questions: quiz.questions.map(q => ({
          ...q,
          options: JSON.parse(q.optionsJson),
        })),
      }))
    );
  } catch (error) {
    console.error('Error fetching practice quizzes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch practice quizzes' },
      { status: 500 }
    );
  }
}
