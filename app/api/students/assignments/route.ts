import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get the student's assignments through their enrolled classes
    const assignments = await prisma.assignment.findMany({
      where: {
        class: {
          students: {
            some: {
              id: session.user.id
            }
          }
        }
      },
      include: {
        class: {
          select: {
            name: true,
            teacher: {
              select: {
                name: true,
              },
            },
          },
        },
        submissions: {
          where: {
            studentId: session.user.id,
          },
          orderBy: {
            submittedAt: 'desc',
          },
          take: 1,
          include: {
            answers: true,
          },
        },
        attachments: true,
        questions: {
          select: {
            id: true,
            question: true,
            options: true,
            explanation: true,
          },
        },
      },
      orderBy: {
        dueDate: 'asc',
      },
    });

    // Transform the data to match the frontend expectations
    const formattedAssignments = assignments.map((assignment) => ({
      id: assignment.id,
      title: assignment.title,
      description: assignment.description || '',
      dueDate: assignment.dueDate.toISOString(),
      className: assignment.class.name,
      teacherName: assignment.class.teacher.name,
      status: assignment.submissions[0]?.status || 'pending',
      grade: assignment.submissions[0]?.grade,
      attachments: assignment.attachments.map(att => ({
        id: att.id,
        fileName: att.fileName,
        url: att.url,
      })),
      questions: assignment.questions.map(q => ({
        id: q.id,
        question: q.question,
        options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
        explanation: q.explanation,
      })),
      submission: assignment.submissions[0]
        ? {
            content: assignment.submissions[0].content || '',
            files: assignment.submissions[0].files ? JSON.parse(assignment.submissions[0].files) : [],
            submittedAt: assignment.submissions[0].submittedAt.toISOString(),
            feedback: assignment.submissions[0].feedback,
            answers: assignment.submissions[0].answers.reduce((acc: any, ans: any) => {
              acc[ans.questionId] = ans.answer;
              return acc;
            }, {}),
          }
        : undefined,
    }));

    return NextResponse.json(formattedAssignments);
  } catch (error) {
    console.error('Error fetching student assignments:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
