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

    // Get assignments with full details
    const assignments = await prisma.assignment.findMany({
      where: {
        class: {
          teacherId: params.teacherId,
        },
      },
      include: {
        class: {
          include: {
            students: true
          }
        },
        questions: {
          select: {
            id: true,
            question: true,
            options: true,
            correctAnswerIndex: true,
            explanation: true,
          }
        },
        submissions: {
          include: {
            answers: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format the response
    const formattedAssignments = assignments.map(assignment => {
      // Calculate stats
      const submissionCount = assignment.submissions.length;
      const totalStudents = assignment.class.students.length;
      
      // Calculate average score
      const totalScore = assignment.submissions.reduce((acc, submission) => {
        const correctAnswers = submission.answers.filter(answer => 
          answer.selectedOption === assignment.questions.find(q => q.id === answer.questionId)?.correctAnswerIndex
        ).length;
        const score = (correctAnswers / assignment.questions.length) * 100;
        return acc + score;
      }, 0);
      
      const averageScore = submissionCount > 0 ? Math.round(totalScore / submissionCount) : 0;

      return {
        id: assignment.id,
        title: assignment.title,
        subject: assignment.subject,
        dueDate: assignment.dueDate,
        class: {
          id: assignment.class.id,
          name: assignment.class.name,
        },
        questions: assignment.questions.map(q => ({
          id: q.id,
          question: q.question,
          options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
          correctAnswerIndex: q.correctAnswerIndex,
          explanation: q.explanation,
        })),
        stats: {
          submissionCount,
          totalStudents,
          averageScore,
        }
      };
    });

    return NextResponse.json(formattedAssignments);
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
    const totalStudents = assignment.class.students.length;
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

// DELETE /api/teachers/[teacherId]/assignments/[assignmentId]
export async function DELETE(
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

    // Delete the assignment
    await prisma.assignment.delete({
      where: {
        id: params.assignmentId,
        class: {
          teacherId: params.teacherId
        }
      }
    });

    return NextResponse.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Failed to delete assignment:', error);
    return NextResponse.json(
      { error: 'Failed to delete assignment' },
      { status: 500 }
    );
  }
}
