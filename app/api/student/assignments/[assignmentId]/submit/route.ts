import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

interface Answer {
  questionId: string;
  answer: string;
}

export async function POST(
  req: Request,
  { params }: { params: { assignmentId: string } }
) {
  try {
    const token = cookies().get('token')?.value;
    
    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const session = await verifyAuth(token);
    
    if (!session || session.role !== 'student') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { answers } = await req.json();

    if (!answers || !Array.isArray(answers)) {
      return new NextResponse('Invalid answers format', { status: 400 });
    }

    // Check if student is enrolled in the class and get questions
    const assignment = await prisma.assignment.findFirst({
      where: {
        id: params.assignmentId,
        class: {
          students: {
            some: {
              id: session.userId
            }
          }
        }
      },
      include: {
        questions: {
          select: {
            id: true,
            correctOption: true
          }
        }
      }
    });

    if (!assignment) {
      return new NextResponse('Assignment not found or not enrolled in class', { status: 404 });
    }

    // Check if assignment is past due date
    if (new Date(assignment.dueDate) < new Date()) {
      return new NextResponse('Assignment is past due date', { status: 400 });
    }

    // Check if student has already submitted
    const existingSubmission = await prisma.homeworkSubmission.findFirst({
      where: {
        studentId: session.userId,
        assignmentId: params.assignmentId
      }
    });

    if (existingSubmission) {
      return new NextResponse('Assignment already submitted', { status: 400 });
    }

    // Process answers and calculate grade
    const processedAnswers = answers.map((answer: Answer) => {
      const question = assignment.questions.find(q => q.id === answer.questionId);
      const isCorrect = question?.correctOption === answer.answer;
      return {
        questionId: answer.questionId,
        answer: answer.answer,
        isCorrect
      };
    });

    // Calculate grade as percentage of correct answers
    const correctAnswers = processedAnswers.filter(a => a.isCorrect).length;
    const grade = Math.round((correctAnswers / assignment.questions.length) * 100);

    // Create submission with answers
    const submission = await prisma.homeworkSubmission.create({
      data: {
        grade,
        student: {
          connect: {
            id: session.userId
          }
        },
        assignment: {
          connect: {
            id: params.assignmentId
          }
        },
        answers: {
          createMany: {
            data: processedAnswers.map(answer => ({
              questionId: answer.questionId,
              answer: answer.answer,
              isCorrect: answer.isCorrect
            }))
          }
        }
      },
      include: {
        answers: true
      }
    });

    return NextResponse.json(submission);
  } catch (error) {
    console.error('Error submitting assignment:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
