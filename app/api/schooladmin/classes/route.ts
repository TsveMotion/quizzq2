import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session?.user?.role !== 'SCHOOLADMIN' || !session?.user?.schoolId) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized - Requires SCHOOLADMIN role' }), 
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const schoolId = session.user.schoolId;

    const classes = await prisma.class.findMany({
      where: {
        schoolId: schoolId,
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            students: true,
            assignments: true, // Changed from quizzes to assignments
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform the response to include quizzes count as assignments
    const transformedClasses = classes.map(classItem => ({
      ...classItem,
      _count: {
        ...classItem._count,
        quizzes: classItem._count.assignments, // Map assignments count to quizzes
      },
    }));

    return new NextResponse(JSON.stringify(transformedClasses), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching classes:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch classes' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session?.user?.role !== 'SCHOOLADMIN' || !session?.user?.schoolId) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized - Requires SCHOOLADMIN role' }), 
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const { name, description, teacherId } = body;

    if (!name || !teacherId) {
      return new NextResponse(
        JSON.stringify({ error: 'Missing required fields' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify teacher exists and belongs to the school
    const teacher = await prisma.user.findFirst({
      where: {
        id: teacherId,
        role: 'TEACHER',
        schoolId: session.user.schoolId,
      },
    });

    if (!teacher) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid teacher selected' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const newClass = await prisma.class.create({
      data: {
        name,
        description: description || '',
        teacherId,
        schoolId: session.user.schoolId,
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            students: true,
            assignments: true,
          },
        },
      },
    });

    // Transform the response to include quizzes count as assignments
    const transformedClass = {
      ...newClass,
      _count: {
        ...newClass._count,
        quizzes: newClass._count.assignments,
      },
    };

    return new NextResponse(JSON.stringify(transformedClass), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating class:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to create class' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session?.user?.role !== 'SCHOOLADMIN' || !session?.user?.schoolId) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized - Requires SCHOOLADMIN role' }), 
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { searchParams } = new URL(req.url);
    const classId = searchParams.get('id');

    if (!classId) {
      return new NextResponse(
        JSON.stringify({ error: 'Class ID is required' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify class exists and belongs to the school
    const existingClass = await prisma.class.findFirst({
      where: {
        id: classId,
        schoolId: session.user.schoolId,
      },
    });

    if (!existingClass) {
      return new NextResponse(
        JSON.stringify({ error: 'Class not found or unauthorized' }), 
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Delete the class
    await prisma.class.delete({
      where: {
        id: classId,
      },
    });

    return new NextResponse(JSON.stringify({ message: 'Class deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting class:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to delete class' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
