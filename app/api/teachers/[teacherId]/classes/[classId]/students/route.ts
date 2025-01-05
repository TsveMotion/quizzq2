import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(
  req: Request,
  { params }: { params: { teacherId: string; classId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.id !== params.teacherId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { studentIds } = await req.json();

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return NextResponse.json(
        { error: 'Student IDs are required' },
        { status: 400 }
      );
    }

    // Verify class exists and belongs to teacher
    const classExists = await prisma.class.findFirst({
      where: {
        id: params.classId,
        teacherId: params.teacherId,
      },
    });

    if (!classExists) {
      return NextResponse.json(
        { error: 'Class not found or unauthorized' },
        { status: 404 }
      );
    }

    // Add students to class
    const updatedClass = await prisma.class.update({
      where: {
        id: params.classId,
      },
      data: {
        students: {
          connect: studentIds.map(id => ({ id })),
        },
      },
      include: {
        students: {
          select: {
            id: true,
            name: true,
            email: true,
            submissions: {
              where: {
                assignment: {
                  classId: params.classId
                }
              },
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
        }
      }
    });

    // Calculate progress for each student
    const studentsWithProgress = updatedClass.students.map(student => {
      const totalAssignments = student.submissions.length;
      const completedAssignments = student.submissions.filter(s => s.grade !== null).length;
      const gradedSubmissions = student.submissions.filter(s => s.grade !== null);
      const totalScore = gradedSubmissions.reduce((sum, s) => sum + (s.grade || 0), 0);
      const averageScore = gradedSubmissions.length > 0 
        ? Math.round(totalScore / gradedSubmissions.length) 
        : 0;
      const progress = totalAssignments > 0 
        ? Math.round((completedAssignments / totalAssignments) * 100) 
        : 0;

      return {
        id: student.id,
        name: student.name,
        email: student.email,
        progress,
        averageScore,
        totalAssignments,
        completedAssignments
      };
    });

    return NextResponse.json({ 
      ...updatedClass, 
      students: studentsWithProgress 
    });
  } catch (error) {
    console.error('Error adding students:', error);
    return NextResponse.json(
      { error: 'Failed to add students to class' },
      { status: 500 }
    );
  }
}
