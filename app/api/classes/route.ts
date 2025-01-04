import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { cookies } from 'next/headers';
import { Prisma } from '@prisma/client';

// GET /api/classes - Get all classes for the logged-in teacher
export async function GET() {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userData = await verifyAuth(token);
    if (!userData || userData.role !== 'teacher') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Fetching classes for teacher:', userData.userId);

    if (!prisma?.class) {
      console.error('Prisma client not initialized properly');
      return NextResponse.json(
        { error: 'Database connection error' },
        { status: 500 }
      );
    }

    const classes = await prisma.class.findMany({
      where: {
        teacherId: userData.userId,
        archived: false,
      },
      include: {
        students: true,
        assignments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log('Found classes:', classes);
    return NextResponse.json({ classes });
  } catch (error) {
    console.error('Failed to fetch classes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch classes: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}

// POST /api/classes - Create a new class
export async function POST(req: Request) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Verifying token...');
    const userData = await verifyAuth(token);
    console.log('Token verified successfully:', userData);

    if (!userData || userData.role !== 'teacher') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!prisma?.user || !prisma?.class) {
      console.error('Prisma client not initialized properly');
      return NextResponse.json(
        { error: 'Database connection error' },
        { status: 500 }
      );
    }

    const { name, description } = await req.json();

    // Get the teacher's school
    console.log('Fetching teacher info...');
    const teacher = await prisma.user.findUnique({
      where: { id: userData.userId },
      select: { schoolId: true },
    });

    console.log('Teacher info:', teacher);

    if (!teacher?.schoolId) {
      return NextResponse.json(
        { error: 'Teacher must be associated with a school' },
        { status: 400 }
      );
    }

    console.log('Creating new class with data:', {
      name,
      description,
      teacherId: userData.userId,
      schoolId: teacher.schoolId,
    });

    const newClass = await prisma.class.create({
      data: {
        name,
        description,
        teacherId: userData.userId,
        schoolId: teacher.schoolId,
      },
      include: {
        students: true,
        assignments: true,
      },
    });

    console.log('Class created successfully:', newClass);
    return NextResponse.json({ class: newClass }, { status: 201 });
  } catch (error) {
    console.error('Failed to create class:', error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'A class with this name already exists' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to create class: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
