import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from "@/lib/prisma";
import bcrypt from 'bcryptjs';

// GET /api/admin/users - Get all users
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');
    const schoolId = searchParams.get('schoolId');

    // Build where clause based on user role and query params
    let where = {};
    
    if (session.user.role?.toLowerCase() === 'schooladmin') {
      // School admins can only see users from their school
      where = {
        schoolId: session.user.schoolId,
        ...(role && { role }),
      };
    } else if (session.user.role?.toLowerCase() === 'superadmin') {
      // Super admins can see all users, with optional filters
      where = {
        ...(role && { role }),
        ...(schoolId && { schoolId }),
      };
    } else {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
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
        createdAt: 'desc',
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('[USERS_GET]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/users - Create a new user
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { email, password, name, role, schoolId } = body;

    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role,
        schoolId,
        status: 'ACTIVE',
      },
      include: {
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
    console.error('[USERS_POST]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
