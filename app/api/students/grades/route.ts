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
      where: { id: session.user.id },
      include: {
        enrolledClasses: {
          select: {
            id: true,
            name: true,
            assignments: {
              select: {
                id: true,
                title: true,
                points: true,
                submissions: {
                  where: {
                    studentId: session.user.id
                  },
                  select: {
                    grade: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    const grades = user?.enrolledClasses.map((classItem) => {
      const totalPoints = classItem.assignments.reduce((sum, assignment) => sum + (assignment.points || 0), 0);
      const earnedPoints = classItem.assignments.reduce((sum, assignment) => {
        const submission = assignment.submissions[0];
        return sum + (submission?.grade || 0);
      }, 0);

      const classGrade = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;

      return {
        classId: classItem.id,
        className: classItem.name,
        grade: classGrade,
        assignments: classItem.assignments.map(assignment => ({
          id: assignment.id,
          title: assignment.title,
          points: assignment.points,
          grade: assignment.submissions[0]?.grade || 0
        }))
      };
    }) || [];

    return NextResponse.json(grades);
  } catch (error) {
    console.error('Error fetching student grades:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
