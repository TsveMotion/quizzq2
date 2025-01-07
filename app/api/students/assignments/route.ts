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
          include: {
            teacher: true
          }
        },
        questions: true,
        submissions: {
          where: {
            studentId: session.user.id
          }
        }
      }
    });

    return NextResponse.json(
      assignments.map((assignment) => ({
        id: assignment.id,
        title: assignment.title,
        description: assignment.description,
        status: assignment.status,
        dueDate: assignment.dueDate,
        totalMarks: assignment.totalMarks,
        class: {
          id: assignment.class.id,
          name: assignment.class.name,
          teacher: assignment.class.teacher
        },
        submissions: assignment.submissions,
        questions: assignment.questions
      }))
    );
  } catch (error) {
    console.error('Error fetching student assignments:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
