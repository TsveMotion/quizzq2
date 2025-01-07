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
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        dueDate: true,
        totalMarks: true,
        class: {
          select: {
            id: true,
            name: true,
            teacher: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        submissions: {
          where: {
            studentId: session.user.id
          },
          select: {
            id: true,
            status: true,
            grade: true,
            submittedAt: true,
            answers: {
              select: {
                id: true,
                answer: true,
                isCorrect: true,
                score: true
              }
            }
          }
        },
        questions: {
          select: {
            id: true,
            text: true,
            type: true,
            options: true,
            points: true,
            marks: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(
      assignments.map((assignment) => ({
        id: assignment.id,
        title: assignment.title,
        description: assignment.description,
        dueDate: assignment.dueDate,
        totalMarks: assignment.totalMarks,
        class: {
          id: assignment.class.id,
          name: assignment.class.name,
          teacher: assignment.class.teacher
        },
        submission: assignment.submissions[0],
        questions: assignment.questions
      }))
    );
  } catch (error) {
    console.error('Error fetching student assignments:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
