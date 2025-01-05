import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// GET /api/teachers/[teacherId]/students
export async function GET(
  req: Request,
  { params }: { params: { teacherId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the teacher has access
    if (session.user.id !== params.teacherId && session.user.role !== 'teacher') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all students for the teacher's classes and directly assigned students
    const students = await prisma.user.findMany({
      where: {
        role: 'student',
        OR: [
          {
            enrolledIn: {
              some: {
                teacherId: params.teacherId
              }
            }
          },
          {
            teacherId: params.teacherId
          }
        ]
      },
      include: {
        enrolledIn: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        submissions: {
          select: {
            id: true,
            grade: true,
            assignment: {
              select: {
                id: true,
                title: true
              }
            }
          }
        }
      }
    });

    // Calculate progress for each student
    const studentsWithProgress = students.map(student => {
      const totalSubmissions = student.submissions?.length || 0;
      const totalScore = student.submissions?.reduce((acc, sub) => acc + (sub.grade || 0), 0) || 0;
      const averageScore = totalSubmissions > 0 ? Math.round(totalScore / totalSubmissions) : 0;

      return {
        ...student,
        progress: {
          averageScore,
          totalSubmissions
        }
      };
    });

    return NextResponse.json(studentsWithProgress);
  } catch (error) {
    console.error('Failed to fetch students:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}

// POST /api/teachers/[teacherId]/students
export async function POST(
  req: Request,
  { params }: { params: { teacherId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the teacher has access
    if (session.user.id !== params.teacherId && session.user.role !== 'teacher') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { name, email, password } = data;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the student
    const student = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'student',
        powerLevel: 1,
        createdBy: {
          connect: {
            id: params.teacherId
          }
        },
        enrolledIn: {
          connect: {
            id: params.teacherId
          }
        }
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    return NextResponse.json(student);
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    );
  }
}
