import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { classId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'TEACHER') {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const teacherId = session.user.id;
    const classId = params.classId;

    // Fetch class details with related data
    const classDetails = await prisma.class.findUnique({
      where: {
        id: classId,
        teacherId: teacherId, // Ensure the teacher owns this class
      },
      include: {
        school: {
          select: {
            name: true,
          },
        },
        students: {
          select: {
            id: true,
            name: true,
            email: true,
          },
          orderBy: {
            name: 'asc',
          },
        },
        assignments: {
          select: {
            id: true,
            title: true,
            dueDate: true,
            createdAt: true,
            _count: {
              select: {
                submissions: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!classDetails) {
      return new NextResponse("Class not found", { status: 404 });
    }

    // Transform the data to include submission count
    const formattedAssignments = classDetails.assignments.map((assignment) => ({
      id: assignment.id,
      title: assignment.title,
      dueDate: assignment.dueDate || new Date(),
      createdAt: assignment.createdAt,
      submissionCount: assignment._count.submissions,
    }));

    return NextResponse.json({
      ...classDetails,
      assignments: formattedAssignments,
    });
  } catch (error) {
    console.error("[CLASS_DETAILS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
