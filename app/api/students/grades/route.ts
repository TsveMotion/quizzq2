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

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      include: {
        enrolledClasses: {
          include: {
            assignments: {
              include: {
                submissions: {
                  where: {
                    studentId: session.user.id,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    const grades = user.enrolledClasses.map((classItem: {
      id: string;
      name: string;
      assignments: Array<{
        title: string;
        weight: number | null;
        submissions: Array<{
          grade: number | null;
        }>;
      }>;
    }) => {
      const assignments = classItem.assignments
        .filter((assignment: {
          submissions: Array<{
            grade: number | null;
          }>;
        }) => assignment.submissions[0]?.grade)
        .map((assignment: {
          title: string;
          weight: number | null;
          submissions: Array<{
            grade: number | null;
          }>;
        }) => ({
          title: assignment.title,
          grade: assignment.submissions[0].grade!,
          weight: assignment.weight || 100 / classItem.assignments.length,
        }));

      const overallGrade =
        assignments.length > 0
          ? assignments.reduce(
              (sum: number, assignment: {
                grade: number;
                weight: number;
              }) => sum + (assignment.grade * assignment.weight) / 100,
              0
            )
          : 0;

      return {
        id: classItem.id,
        className: classItem.name,
        overallGrade: Math.round(overallGrade * 100) / 100,
        assignments,
      };
    });

    return NextResponse.json(grades);
  } catch (error) {
    console.error('Error fetching student grades:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
