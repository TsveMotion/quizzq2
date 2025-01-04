import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

// GET /api/students - Get all students for a teacher
export async function GET(req: Request) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userData = await verifyAuth(token);
    if (!userData || userData.role !== 'teacher') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get teacher's school
    const teacher = await prisma.user.findUnique({
      where: { id: userData.userId },
      select: { schoolId: true },
    });

    if (!teacher?.schoolId) {
      return NextResponse.json(
        { error: 'Teacher not associated with a school' },
        { status: 400 }
      );
    }

    // Get all students in the teacher's school
    const students = await prisma.user.findMany({
      where: {
        role: 'student',
        schoolId: teacher.schoolId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        enrolledIn: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ students });
  } catch (error) {
    console.error('Failed to fetch students:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}

// POST /api/students - Create a new student
export async function POST(req: Request) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userData = await verifyAuth(token);
    if (!userData || userData.role !== 'teacher') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get teacher's school
    const teacher = await prisma.user.findUnique({
      where: { id: userData.userId },
      select: { schoolId: true },
    });

    if (!teacher?.schoolId) {
      return NextResponse.json(
        { error: 'Teacher not associated with a school' },
        { status: 400 }
      );
    }

    const { name, email, password } = await req.json();

    // Check if email is already in use
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create student
    const student = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'student',
        schoolId: teacher.schoolId,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json({ student });
  } catch (error) {
    console.error('Failed to create student:', error);
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    );
  }
}
