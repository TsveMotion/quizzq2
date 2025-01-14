import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'TEACHER') {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const teacherId = session.user.id;

    const assignments = await prisma.assignment.findMany({
      where: {
        teacherId: teacherId,
      },
      include: {
        class: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            submissions: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(assignments);
  } catch (error) {
    console.error("[ASSIGNMENTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'TEACHER') {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const dueDate = new Date(formData.get("dueDate") as string);
    const classId = formData.get("classId") as string;
    const questionsJson = formData.get("questions") as string;
    
    if (!questionsJson) {
      return new NextResponse("Questions are required", { status: 400 });
    }

    let questions;
    try {
      questions = JSON.parse(questionsJson);
      if (!Array.isArray(questions)) {
        return new NextResponse("Questions must be an array", { status: 400 });
      }
    } catch (error) {
      return new NextResponse("Invalid questions format", { status: 400 });
    }

    // Create the assignment
    const createdAssignment = await prisma.assignment.create({
      data: {
        title,
        description,
        dueDate,
        classId,
        teacherId: session.user.id,
        weight: 100, // Default total weight
      },
    });

    // Create questions with marks
    let totalMarks = 0;
    for (let index = 0; index < questions.length; index++) {
      const question = questions[index];
      const marks = question.marks || 10; // Default 10 marks per question if not specified
      totalMarks += marks;
      
      const createdQuestion = await prisma.question.create({
        data: {
          question: question.text,
          options: question.options,
          correctAnswer: question.correctAnswer,
          assignmentId: createdAssignment.id,
          type: question.type || 'MULTIPLE_CHOICE',
          points: question.points || 10,
          order: index + 1
        }
      });
    }

    // Update assignment with calculated total marks
    await prisma.assignment.update({
      where: { id: createdAssignment.id },
      data: { totalMarks }
    });

    return NextResponse.json({
      success: true,
      data: createdAssignment,
    });
  } catch (error) {
    console.error("[CREATE_ASSIGNMENT]", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal server error",
      { status: 500 }
    );
  }
}
