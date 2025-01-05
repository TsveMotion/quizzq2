import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { school: true }
    });

    if (!currentUser || !['superadmin', 'schooladmin', 'teacher'].includes(currentUser.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const data = await req.json();
    const { name, email, password, role, schoolId } = data;

    // Teachers can only create students
    if (currentUser.role === 'teacher' && role !== 'student') {
      return NextResponse.json({ error: 'Teachers can only create student accounts' }, { status: 403 });
    }

    // Validate school access
    if ((currentUser.role === 'schooladmin' || currentUser.role === 'teacher') && currentUser.schoolId !== schoolId) {
      return NextResponse.json({ error: 'Unauthorized access to school' }, { status: 403 });
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        powerLevel: role === 'student' ? 1 : 2,
        school: {
          connect: {
            id: schoolId
          }
        },
        ...(role === 'student' && currentUser.role === 'teacher' ? {
          teacherId: currentUser.id
        } : {})
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        school: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { school: true }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get query parameters
    const url = new URL(req.url);
    const schoolId = url.searchParams.get('schoolId');
    const role = url.searchParams.get('role');

    // Build where clause
    const where: any = {};
    if (currentUser.role === 'schooladmin') {
      where.schoolId = currentUser.schoolId;
    } else if (schoolId) {
      where.schoolId = schoolId;
    }
    if (role) {
      where.role = role;
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        school: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            submissions: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'superadmin') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return new NextResponse('User ID is required', { status: 400 });
    }

    await prisma.user.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
