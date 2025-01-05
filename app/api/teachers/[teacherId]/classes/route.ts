import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/teachers/[teacherId]/classes
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

    // Get all classes for the teacher
    const classes = await prisma.class.findMany({
      where: {
        teacherId: params.teacherId
      },
      include: {
        students: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        assignments: {
          select: {
            id: true,
            title: true,
            dueDate: true,
            content: true,
            questions: true,
            submissions: true
          }
        }
      }
    });

    return NextResponse.json(classes);
  } catch (error) {
    console.error('Failed to fetch classes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch classes' },
      { status: 500 }
    );
  }
}

// POST /api/teachers/[teacherId]/classes
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

    const body = await req.json();
    const { name, description, yearGroup } = body;

    // Validate required fields
    if (!name || !yearGroup) {
      return NextResponse.json(
        { error: 'Name and year group are required' },
        { status: 400 }
      );
    }

    // Create class
    const newClass = await prisma.class.create({
      data: {
        name,
        description,
        yearGroup,
        teacherId: params.teacherId,
        schoolId: session.user.schoolId
      },
      include: {
        students: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(newClass);
  } catch (error) {
    console.error('Error creating class:', error);
    return NextResponse.json(
      { error: 'Failed to create class' },
      { status: 500 }
    );
  }
}

// PUT /api/teachers/[teacherId]/classes/[classId]/students
export async function PUT(
  req: Request,
  { params }: { params: { teacherId: string; classId: string } }
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

    const body = await req.json();
    const { studentIds } = body;

    if (!Array.isArray(studentIds)) {
      return NextResponse.json(
        { error: 'Student IDs must be an array' },
        { status: 400 }
      );
    }

    // Verify the class belongs to the teacher
    const classExists = await prisma.class.findFirst({
      where: {
        id: params.classId,
        teacherId: params.teacherId
      }
    });

    if (!classExists) {
      return NextResponse.json(
        { error: 'Class not found or unauthorized' },
        { status: 404 }
      );
    }

    // Update class students
    const updatedClass = await prisma.class.update({
      where: {
        id: params.classId
      },
      data: {
        students: {
          connect: studentIds.map(id => ({ id }))
        }
      },
      include: {
        students: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(updatedClass);
  } catch (error) {
    console.error('Error updating class students:', error);
    return NextResponse.json(
      { error: 'Failed to update class students' },
      { status: 500 }
    );
  }
}
