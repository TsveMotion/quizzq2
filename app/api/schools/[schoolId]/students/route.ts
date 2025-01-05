import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// GET /api/schools/[schoolId]/students - Get all students for a specific school
export async function GET(
  request: Request,
  { params }: { params: { schoolId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const schoolId = params.schoolId;

    const students = await prisma.user.findMany({
      where: {
        schoolId: schoolId,
        role: 'STUDENT',
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        enrolledClasses: {
          select: {
            id: true,
            name: true,
            teacher: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error("[STUDENTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// POST /api/schools/[schoolId]/students - Create a new student
export async function POST(
  request: Request,
  { params }: { params: { schoolId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const schoolId = params.schoolId;
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'STUDENT',
        schoolId,
      },
    });

    return NextResponse.json(student);
  } catch (error) {
    console.error("[STUDENTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE /api/schools/[schoolId]/students/[studentId] - Delete a student
export async function DELETE(
  req: Request,
  { params }: { params: { schoolId: string; studentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete the student
    await prisma.user.delete({
      where: {
        id: params.studentId,
        schoolId: params.schoolId,
        role: 'STUDENT'
      }
    });

    return NextResponse.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json(
      { error: 'Failed to delete student' },
      { status: 500 }
    );
  }
}
