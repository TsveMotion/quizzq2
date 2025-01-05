import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { teacherId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.id !== params.teacherId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json([]);
    }

    // Get teacher's school
    const teacher = await prisma.user.findUnique({
      where: { id: params.teacherId },
      select: { schoolId: true }
    });

    if (!teacher?.schoolId) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    // Search for students in the same school
    const students = await prisma.user.findMany({
      where: {
        schoolId: teacher.schoolId,
        OR: [
          { role: 'student' },
          { role: 'STUDENT' }
        ],
        AND: [
          {
            OR: [
              { name: { contains: query } },
              { email: { contains: query } }
            ]
          }
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        enrolledIn: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Map enrolledIn to classes for frontend consistency
    const formattedStudents = students.map(student => ({
      ...student,
      classes: student.enrolledIn
    }));

    return NextResponse.json(formattedStudents);
  } catch (error) {
    console.error('Error searching students:', error);
    return NextResponse.json(
      { error: 'Failed to search students' },
      { status: 500 }
    );
  }
}
