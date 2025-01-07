import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.log('No session or email found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        role: true,
        schoolId: true,
      },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Only allow school admins to create users for their school
    if (currentUser.role !== "SCHOOLADMIN") {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const data = await req.json();
    const { name, email, password, role } = data;

    // Create user data
    const userData = {
      name,
      email,
      password: await hash(password, 10),
      role,
      status: "ACTIVE",
      powerLevel: 1,
      schoolId: currentUser.schoolId,
    };

    // Create user
    const user = await prisma.user.create({
      data: userData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    console.log('User created:', user);
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    if (error instanceof Error && 
        typeof (error as any).code === 'string' && 
        (error as any).code === 'P2002') {
      console.log('User with this email already exists');
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      console.log('No session or email found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Looking up user:', session.user.email);
    const currentUser = await prisma.user.findFirst({
      where: { 
        email: session.user.email,
      },
      select: {
        id: true,
        role: true,
        schoolId: true,
      }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!['SUPERADMIN', 'SCHOOLADMIN', 'TEACHER'].includes(currentUser.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    console.log('Current user role:', currentUser.role);

    // Get query parameters
    const url = new URL(req.url);
    const schoolId = url.searchParams.get('schoolId');
    const role = url.searchParams.get('role');

    // Build where clause based on user role
    const where: any = {
      status: 'ACTIVE' // Only show active users
    };

    // Role-based filtering
    if (currentUser.role === 'SCHOOLADMIN') {
      where.schoolId = currentUser.schoolId;
    } else if (currentUser.role === 'TEACHER') {
      where.OR = [
        { teacherId: currentUser.id }, // Students assigned to this teacher
        { schoolId: currentUser.schoolId, role: 'TEACHER' } // Other teachers in same school
      ];
    } else if (currentUser.role !== 'SUPERADMIN') {
      if (!currentUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      console.log('Insufficient permissions for role:', currentUser.role);
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Additional filters from query params
    if (schoolId && (currentUser.role === 'SUPERADMIN' || currentUser.schoolId === schoolId)) {
      where.schoolId = schoolId;
    }
    if (role) {
      where.role = role.toUpperCase();
    }

    console.log('Fetching users with where clause:', where);
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        school: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('Found users:', users.length);
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
    if (!session?.user?.email) {
      console.log('No session or email found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await prisma.user.findFirst({
      where: { 
        email: session.user.email,
        role: 'SUPERADMIN'
      },
      select: {
        id: true,
        role: true,
        schoolId: true,
      }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      console.log('User ID is required');
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id }
    });

    console.log('User deleted successfully');
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
