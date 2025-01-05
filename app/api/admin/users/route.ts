import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/admin/users - Get all users
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only allow superadmin and schooladmin
    if (!['superadmin', 'schooladmin'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get('schoolId');
    const role = searchParams.get('role');

    // Build where clause
    const where: any = {};
    if (schoolId) where.schoolId = schoolId;
    if (role) where.role = role;

    // If school admin, only show users from their school
    if (session.user.role === 'schooladmin') {
      where.schoolId = session.user.schoolId;
    }

    const users = await prisma.user.findMany({
      where,
      include: {
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

    // Remove sensitive data from response
    const sanitizedUsers = users.map(({ password, ...user }) => user);

    return NextResponse.json(sanitizedUsers);
  } catch (error) {
    console.error('Failed to get users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/admin/users - Create a new user
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only allow superadmin and schooladmin to create users
    if (!['superadmin', 'schooladmin'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const data = await req.json();
    const { name, email, password, role, schoolId } = data;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate role permissions
    if (session.user.role === 'schooladmin') {
      // School admins can only create teachers and students
      if (!['teacher', 'student'].includes(role)) {
        return NextResponse.json(
          { error: 'School admins can only create teachers and students' },
          { status: 403 }
        );
      }
      // School admins can only create users for their school
      if (schoolId !== session.user.schoolId) {
        return NextResponse.json(
          { error: 'Cannot create users for other schools' },
          { status: 403 }
        );
      }
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
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
        powerLevel: role === 'student' ? 1 : role === 'teacher' ? 3 : 2,
        school: schoolId ? {
          connect: { id: schoolId }
        } : undefined
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        powerLevel: true,
        schoolId: true,
        school: {
          select: {
            id: true,
            name: true
          }
        },
        createdAt: true,
        updatedAt: true
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
