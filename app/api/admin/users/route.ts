import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// GET /api/admin/users - Get all users
export async function GET(req: Request) {
  try {
    // Verify admin token
    const session = await verifyToken();
    if (!session || (session.role !== 'superadmin' && session.role !== 'schooladmin')) {
      return new NextResponse('Unauthorized', { status: 401 });
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
    if (session.role === 'schooladmin') {
      where.schoolId = session.schoolId;
    }

    const users = await prisma.user.findMany({
      where,
      include: {
        school: true,
      },
    });

    // Remove passwords from response
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return new NextResponse(JSON.stringify(usersWithoutPasswords), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Failed to get users:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to get users' }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// POST /api/admin/users - Create a new user
export async function POST(req: Request) {
  try {
    // Verify admin token
    const session = await verifyToken();
    if (!session || (session.role !== 'superadmin' && session.role !== 'schooladmin')) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { email, password, name, role, schoolId } = await req.json();

    if (!email || !password || !role || !schoolId) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Check if user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'User with this email already exists',
          code: 'EMAIL_EXISTS'
        }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Verify school exists
    const school = await prisma.school.findUnique({
      where: { id: schoolId }
    });

    if (!school) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'School not found',
          code: 'SCHOOL_NOT_FOUND'
        }), 
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Set power level based on role
    let powerLevel = 1;
    switch (role) {
      case 'superadmin':
        powerLevel = 5;
        break;
      case 'schooladmin':
        powerLevel = 4;
        break;
      case 'teacher':
        powerLevel = 3;
        break;
      case 'student':
        powerLevel = 1;
        break;
      default:
        powerLevel = 1;
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || email.split('@')[0],
        role,
        powerLevel,
        school: {
          connect: {
            id: schoolId
          }
        }
      }
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return new NextResponse(JSON.stringify(userWithoutPassword), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error: any) {
    console.error('Failed to create user:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: 'Failed to create user',
        details: error.message,
        code: error.code
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
