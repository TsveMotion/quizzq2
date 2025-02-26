import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { classId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const classId = params.classId;
    if (!classId) {
      return new NextResponse('Class ID is required', { status: 400 });
    }

    // First, verify that the student is enrolled in this class
    const studentClass = await prisma.class.findFirst({
      where: {
        id: classId,
        students: {
          some: {
            id: session.user.id
          }
        }
      }
    });

    if (!studentClass) {
      return new NextResponse('Class not found or student not enrolled', { status: 404 });
    }

    // Fetch class details with teacher and students
    const classDetails = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        teacher: true,
        students: true,
        assignments: {
          include: {
            submissions: {
              select: {
                id: true,
                status: true,
                score: true,
                createdAt: true,
                updatedAt: true
              }
            }
          }
        }
      }
    });

    if (!classDetails) {
      return new NextResponse('Class not found', { status: 404 });
    }

    // Format the response
    const formattedResponse = {
      id: classDetails.id,
      name: classDetails.name,
      description: classDetails.description || '',
      teacherName: classDetails.teacher.name,
      teacherEmail: classDetails.teacher.email,
      schedule: 'Schedule not set', // Add this field to Class model if needed
      subject: 'Subject not set', // Add this field to Class model if needed
      assignments: classDetails.assignments.map((assignment) => ({
        id: assignment.id,
        title: assignment.title,
        description: assignment.description,
        dueDate: assignment.dueDate || new Date(), // Provide default date if null
        status: assignment.submissions[0]?.status || 'pending',
      })),
      students: classDetails.students
        .filter((student: { id: string }) => student.id !== session.user.id) // Exclude current student
        .map((student: { id: string; name: string; email: string }) => ({
          id: student.id,
          name: student.name,
          email: student.email,
        })),
      announcements: [], // Add announcements model if needed
    };

    return NextResponse.json(formattedResponse);
  } catch (error) {
    console.error('Error fetching class details:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
