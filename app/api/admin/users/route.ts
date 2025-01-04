import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { ROLES } from '@/lib/roles';

// GET /api/admin/users - Get all users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        school: true
      }
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/admin/users - Create a new user
export async function POST(req: Request) {
  try {
    const { name, email, password, role, schoolId } = await req.json();

    // Validate role
    if (!Object.values(ROLES).includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get power level based on role
    const powerLevel = {
      [ROLES.MEMBER]: 1,
      [ROLES.STUDENT]: 2,
      [ROLES.TEACHER]: 3,
      [ROLES.SCHOOLADMIN]: 4,
      [ROLES.SUPERADMIN]: 5,
    }[role] || 1;

    // If role is school-related, validate schoolId
    if ((role === ROLES.STUDENT || role === ROLES.TEACHER || role === ROLES.SCHOOLADMIN) && !schoolId) {
      return NextResponse.json(
        { error: 'School ID is required for school roles' },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        powerLevel,
        schoolId: schoolId || null,
      },
      include: {
        school: true
      }
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error('Failed to create user:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
