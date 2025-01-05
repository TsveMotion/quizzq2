import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(
  req: Request,
  { params }: { params: { teacherId: string; classId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.id !== params.teacherId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, subject, topic, dueDate, questions } = await req.json();

    if (!title || !dueDate || !questions) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify class exists and belongs to teacher
    const classExists = await prisma.class.findFirst({
      where: {
        id: params.classId,
        teacherId: params.teacherId,
      },
    });

    if (!classExists) {
      return NextResponse.json(
        { error: 'Class not found or unauthorized' },
        { status: 404 }
      );
    }

    // Create the assignment with questions
    const assignment = await prisma.assignment.create({
      data: {
        title,
        content: JSON.stringify({ subject, topic, questions }), // Store metadata in content
        dueDate: new Date(dueDate),
        questions: {
          create: questions.map((q: any) => ({
            question: q.question,
            options: JSON.stringify(q.options),
            correctAnswerIndex: q.correctAnswerIndex,
            explanation: q.explanation
          }))
        },
        class: {
          connect: { id: params.classId }
        },
        teacher: {
          connect: { id: params.teacherId }
        }
      },
      include: {
        questions: true,
        submissions: true,
        class: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    // Format the response to match the expected format
    const formattedAssignment = {
      ...assignment,
      questions: assignment.questions.map(q => ({
        id: q.id,
        question: q.question,
        options: JSON.parse(q.options),
        correctAnswerIndex: q.correctAnswerIndex,
        explanation: q.explanation
      }))
    };

    return NextResponse.json(formattedAssignment);
  } catch (error: any) {
    console.error('Error creating assignment:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create assignment',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
