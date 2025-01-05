import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/teachers/[teacherId]/assignments
export async function GET(
  req: Request,
  { params }: { params: { teacherId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the teacher has access
    if (session.user.id !== params.teacherId && session.user.role !== 'teacher') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all assignments for the teacher's classes
    const assignments = await prisma.assignment.findMany({
      where: {
        class: {
          teacherId: params.teacherId
        }
      },
      include: {
        class: {
          select: {
            id: true,
            name: true,
            students: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        questions: true,
        submissions: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(assignments);
  } catch (error) {
    console.error('Failed to fetch assignments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assignments' },
      { status: 500 }
    );
  }
}

// POST /api/teachers/[teacherId]/assignments
export async function POST(
  req: Request,
  { params }: { params: { teacherId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the teacher has access
    if (session.user.id !== params.teacherId && session.user.role !== 'teacher') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { 
      title, 
      classId, 
      dueDate, 
      subject, 
      topic, 
      yearGroup, 
      complexity,
      questions 
    } = body;

    // Validate required fields
    if (!title || !classId || !dueDate || !subject || !topic || !yearGroup || !complexity || !questions) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify the class belongs to the teacher
    const classExists = await prisma.class.findFirst({
      where: {
        id: classId,
        teacherId: params.teacherId
      }
    });

    if (!classExists) {
      return NextResponse.json(
        { error: 'Class not found or unauthorized' },
        { status: 404 }
      );
    }

    // Create assignment with questions
    const assignment = await prisma.assignment.create({
      data: {
        title,
        classId,
        dueDate,
        subject,
        topic,
        yearGroup,
        complexity,
        questions: {
          create: questions.map(q => ({
            questionText: q.questionText,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correctOption: q.correctOption,
            explanation: q.explanation
          }))
        }
      },
      include: {
        class: {
          select: {
            id: true,
            name: true,
            students: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        questions: true
      }
    });

    return NextResponse.json(assignment);
  } catch (error) {
    console.error('Error creating assignment:', error);
    return NextResponse.json(
      { error: 'Failed to create assignment' },
      { status: 500 }
    );
  }
}

// GET /api/teachers/[teacherId]/assignments/[assignmentId]/performance
export async function GET_PERFORMANCE(
  req: Request,
  { params }: { params: { teacherId: string; assignmentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the teacher has access
    if (session.user.id !== params.teacherId && session.user.role !== 'teacher') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get assignment performance data
    const assignment = await prisma.assignment.findUnique({
      where: {
        id: params.assignmentId,
        class: {
          teacherId: params.teacherId
        }
      },
      include: {
        questions: true,
        submissions: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            answers: true
          }
        }
      }
    });

    if (!assignment) {
      return NextResponse.json(
        { error: 'Assignment not found or unauthorized' },
        { status: 404 }
      );
    }

    // Calculate performance metrics
    const totalStudents = assignment.submissions.length;
    const averageScore = assignment.submissions.reduce((acc, sub) => {
      const correctAnswers = sub.answers.filter(a => a.isCorrect).length;
      return acc + (correctAnswers / assignment.questions.length) * 100;
    }, 0) / totalStudents;

    const questionStats = assignment.questions.map(q => {
      const totalAttempts = assignment.submissions.length;
      const correctAttempts = assignment.submissions.reduce((acc, sub) => {
        const answer = sub.answers.find(a => a.questionId === q.id);
        return acc + (answer?.isCorrect ? 1 : 0);
      }, 0);

      return {
        questionId: q.id,
        questionText: q.questionText,
        correctPercentage: (correctAttempts / totalAttempts) * 100
      };
    });

    return NextResponse.json({
      assignmentId: assignment.id,
      title: assignment.title,
      totalStudents,
      averageScore,
      questionStats,
      submissions: assignment.submissions
    });
  } catch (error) {
    console.error('Failed to fetch assignment performance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assignment performance' },
      { status: 500 }
    );
  }
}
