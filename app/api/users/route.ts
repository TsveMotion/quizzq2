import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
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
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - No session found' }, 
        { status: 401 }
      );
    }

    // Extract user data safely
    const userId = session?.user?.id;
    const userRole = session?.user?.role;

    if (!userId || !userRole) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid session data' }, 
        { status: 401 }
      );
    }

    // For SUPERADMIN, fetch all users
    if (userRole === 'SUPERADMIN') {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          schoolId: true,
          status: true,
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

      return NextResponse.json(users);
    }

    // For other roles, fetch the current user first
    const currentUser = await prisma.user.findUnique({
      where: { 
        id: userId 
      },
      select: {
        id: true,
        role: true,
        schoolId: true,
      }
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' }, 
        { status: 404 }
      );
    }

    // Build where clause based on user role
    const where: any = {};

    // Role-based filtering
    if (currentUser.role === 'SCHOOLADMIN') {
      where.schoolId = currentUser.schoolId;
    } else if (currentUser.role === 'TEACHER') {
      where.OR = [
        { teacherId: currentUser.id },
        { schoolId: currentUser.schoolId, role: 'TEACHER' }
      ];
    } else {
      return NextResponse.json(
        { error: 'Insufficient permissions' }, 
        { status: 403 }
      );
    }

    // Get query parameters
    const url = new URL(req.url);
    const schoolId = url.searchParams.get('schoolId');
    const role = url.searchParams.get('role');

    // Additional filters from query params
    if (schoolId && currentUser.schoolId === schoolId) {
      where.schoolId = schoolId;
    }
    if (role) {
      where.role = role.toUpperCase();
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        schoolId: true,
        status: true,
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
    const userId = session?.user?.id;
    
    if (!session || !userId) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const targetUserId = url.searchParams.get('id');

    if (!targetUserId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, schoolId: true }
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Current user not found' },
        { status: 404 }
      );
    }

    // Only SUPERADMIN or SCHOOLADMIN can delete users
    if (currentUser.role !== 'SUPERADMIN' && currentUser.role !== 'SCHOOLADMIN') {
      return NextResponse.json(
        { error: 'Not authorized to delete users' },
        { status: 403 }
      );
    }

    // If SCHOOLADMIN, can only delete users from their school
    if (currentUser.role === 'SCHOOLADMIN') {
      const targetUser = await prisma.user.findUnique({
        where: { id: targetUserId },
        select: { schoolId: true }
      });

      if (targetUser?.schoolId !== currentUser.schoolId) {
        return NextResponse.json(
          { error: 'Not authorized to delete users from other schools' },
          { status: 403 }
        );
      }
    }

    await prisma.user.delete({
      where: { id: targetUserId }
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
