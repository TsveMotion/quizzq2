import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { Role } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
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

    // Allow both SUPERADMIN and SCHOOLADMIN to create users
    if (!Object.values(Role).includes(currentUser.role as Role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const data = await req.json();
    const { name, email, password, role, schoolId } = data;

    console.log('Received role:', role);
    console.log('Available roles:', Object.keys(Role));

    // Convert role string to enum
    const userRole = role as Role;
    if (!Object.values(Role).includes(userRole as Role)) {
      console.log('Invalid role value:', userRole);
      return NextResponse.json({ 
        error: `Invalid role. Must be one of: ${Object.values(Role).join(', ')}` 
      }, { status: 400 });
    }

    // Validate school admin permissions
    if (currentUser.role === Role.SCHOOLADMIN) {
      if (userRole === Role.SUPERADMIN || userRole === Role.SCHOOLADMIN) {
        return NextResponse.json(
          { error: 'School admins cannot create admin users' },
          { status: 403 }
        );
      }
      if (schoolId && schoolId !== currentUser.schoolId) {
        return NextResponse.json(
          { error: 'School admins can only create users for their own school' },
          { status: 403 }
        );
      }
    }

    // Create user data
    const userData = {
      name,
      email,
      password: await hash(password, 10),
      role: userRole,
      status: "ACTIVE",
      schoolId: schoolId === 'none' ? null : schoolId,
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
        schoolId: true,
        createdAt: true,
      },
    });

    console.log('User created:', user);
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    if (error instanceof Error && 
        'code' in error &&
        error.code === 'P2002') {
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

    // Test database connection first
    try {
      await prisma.$connect();
    } catch (error) {
      console.error('Database connection error:', error);
      return NextResponse.json(
        { error: 'Database connection failed. Please try again later.' },
        { status: 503 }
      );
    }

    let users = [];

    // For SUPERADMIN, fetch all users
    if (userRole === Role.SUPERADMIN) {
      try {
        users = await prisma.user.findMany({
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
      } catch (error) {
        console.error('Error fetching users for SUPERADMIN:', error);
        return NextResponse.json(
          { error: 'Failed to fetch users data' },
          { status: 500 }
        );
      }

      return NextResponse.json(users);
    }

    // For other roles, fetch the current user first
    let currentUser;
    try {
      currentUser = await prisma.user.findUnique({
        where: { 
          id: userId 
        },
        select: {
          id: true,
          role: true,
          schoolId: true,
        }
      });
    } catch (error) {
      console.error('Error fetching current user:', error);
      return NextResponse.json(
        { error: 'Failed to fetch user data' },
        { status: 500 }
      );
    }

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' }, 
        { status: 404 }
      );
    }

    // Build where clause based on user role
    const where: any = {};

    // Role-based filtering
    if (currentUser.role === Role.SCHOOLADMIN) {
      where.schoolId = currentUser.schoolId;
    } else if (currentUser.role === Role.TEACHER) {
      where.OR = [
        { teacherId: currentUser.id },
        { schoolId: currentUser.schoolId, role: Role.TEACHER }
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
      where.role = Role[role as keyof typeof Role];
    }

    try {
      users = await prisma.user.findMany({
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
    } catch (error) {
      console.error('Error fetching filtered users:', error);
      return NextResponse.json(
        { error: 'Failed to fetch users data' },
        { status: 500 }
      );
    }

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error in users route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
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
    if (!Object.values(Role).includes(currentUser.role as Role)) {
      return NextResponse.json(
        { error: 'Not authorized to delete users' },
        { status: 403 }
      );
    }

    // If SCHOOLADMIN, can only delete users from their school
    if (currentUser.role === Role.SCHOOLADMIN) {
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
