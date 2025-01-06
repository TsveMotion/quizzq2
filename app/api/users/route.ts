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

    const currentUser = await prisma.user.findFirst({
      where: { 
        email: session.user.email,
      },
      include: { 
        school: true 
      }
    });

    if (!currentUser || !['SUPERADMIN', 'SCHOOLADMIN', 'TEACHER'].includes(currentUser.role)) {
      console.log('Insufficient permissions for role:', currentUser.role);
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const data = await req.json();
    const { name, email, password, role, schoolId } = data;

    // Teachers can only create students
    if (currentUser.role === 'TEACHER' && role !== 'STUDENT') {
      console.log('Teachers can only create student accounts');
      return NextResponse.json({ error: 'Teachers can only create student accounts' }, { status: 403 });
    }

    // Validate school access
    if ((currentUser.role === 'SCHOOLADMIN' || currentUser.role === 'TEACHER') && currentUser.schoolId !== schoolId) {
      console.log('Unauthorized access to school');
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
        role: role.toUpperCase(),
        status: 'ACTIVE',
        powerLevel: role.toUpperCase() === 'STUDENT' ? 1 : 2,
        school: {
          connect: {
            id: schoolId
          }
        },
        ...(role.toUpperCase() === 'STUDENT' && currentUser.role === 'TEACHER' ? {
          teacherId: currentUser.id
        } : {})
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        school: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    console.log('User created:', user);
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.code === 'P2002') {
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
      }
    });

    if (!currentUser) {
      console.log('Current user not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
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
      }
    });

    if (!currentUser) {
      console.log('Insufficient permissions for role:', currentUser.role);
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
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
