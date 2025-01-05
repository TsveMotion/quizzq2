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

    // Get teacher's school
    const teacher = await prisma.user.findUnique({
      where: { id: params.teacherId },
      select: { schoolId: true }
    });

    if (!teacher?.schoolId) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    // Get all students in the school, handling both 'student' and 'STUDENT' roles
    const students = await prisma.user.findMany({
      where: {
        schoolId: teacher.schoolId,
        OR: [
          { role: 'student' },
          { role: 'STUDENT' }
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
        },
        submissions: {
          select: {
            id: true,
            grade: true,
            createdAt: true,
            assignment: {
              select: {
                id: true,
                title: true,
                dueDate: true
              }
            }
          }
        }
      }
    });

    // Calculate progress for each student
    const studentsWithProgress = students.map(student => {
      const totalAssignments = student.submissions.length;
      
      // Consider a submission completed if it has a grade
      const completedAssignments = student.submissions.filter(s => s.grade !== null).length;
      
      // Calculate average score from graded assignments
      const gradedSubmissions = student.submissions.filter(s => s.grade !== null);
      const totalScore = gradedSubmissions.reduce((sum, s) => sum + (s.grade || 0), 0);
      const averageScore = gradedSubmissions.length > 0 
        ? Math.round(totalScore / gradedSubmissions.length) 
        : 0;

      // Calculate progress based on submissions vs due assignments
      const progress = totalAssignments > 0 
        ? Math.round((completedAssignments / totalAssignments) * 100) 
        : 0;

      // Rename enrolledIn to classes for frontend consistency
      const { enrolledIn, ...rest } = student;
      return {
        ...rest,
        classes: enrolledIn,
        progress,
        averageScore,
        totalAssignments,
        completedAssignments
      };
    });

    return NextResponse.json(studentsWithProgress);
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}
