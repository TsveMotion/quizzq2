import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { assignmentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'TEACHER') {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const teacherId = session.user.id;
    const assignmentId = params.assignmentId;

    // Fetch assignment details with related data
    const assignment = await prisma.assignment.findUnique({
      where: {
        id: assignmentId,
        teacherId: teacherId, // Ensure the teacher owns this assignment
      },
      include: {
        class: {
          select: {
            name: true,
            students: {
              select: {
                id: true,
                name: true,
                email: true,
                submissions: {
                  where: {
                    assignmentId: assignmentId,
                  },
                  select: {
                    id: true,
                    createdAt: true,
                    status: true,
                    grade: true,
                  },
                  take: 1,
                },
              },
              orderBy: {
                name: 'asc',
              },
            },
          },
        },
        _count: {
          select: {
            submissions: true,
          },
        },
      },
    });

    if (!assignment) {
      return new NextResponse("Assignment not found", { status: 404 });
    }

    // Transform the data to include submission info directly in student object
    const transformedAssignment = {
      ...assignment,
      class: {
        ...assignment.class,
        students: assignment.class.students.map(student => ({
          ...student,
          submission: student.submissions[0],
          submissions: undefined,
        })),
      },
    };

    return NextResponse.json(transformedAssignment);
  } catch (error) {
    console.error("[ASSIGNMENT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
