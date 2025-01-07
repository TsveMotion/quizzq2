import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

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
    const formattedAssignments = assignments.map((assignment) => {
      const submission = assignment.submissions.find(
        (sub) => sub.studentId === session.user.id
      );

      return {
        id: assignment.id,
        title: assignment.title,
        description: assignment.description,
        dueDate: assignment.dueDate,
        class: {
          name: assignment.class.name,
          teacher: {
            name: assignment.class.teacher?.name || "Unknown",
          },
        },
        submission: submission
          ? {
              id: submission.id,
              status: submission.status,
              grade: submission.grade,
              content: submission.content,
              files: submission.files,
              submittedAt: submission.submittedAt,
              feedback: submission.feedback,
              answers: submission.answers.map((ans) => ({
                questionId: ans.questionId,
                answer: parseInt(ans.answer),
              })),
            }
          : undefined,
      };
    });

    return NextResponse.json(formattedAssignments);
  } catch (error) {
    console.error('Error fetching student assignments:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
