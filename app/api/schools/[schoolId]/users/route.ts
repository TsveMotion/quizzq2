import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { verifyAuth } from '@/lib/auth';
import { cookies } from 'next/headers';

// GET /api/schools/[schoolId]/users - Get all users for a specific school
export async function GET(
  req: Request,
  { params }: { params: { schoolId: string } }
) {
  try {
    if (!params.schoolId) {
      return NextResponse.json({ error: 'School ID is required' }, { status: 400 });
    }

    // Get token from cookie
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized - No token' }, { status: 401 });
    }

    const userData = await verifyAuth(token);
    if (!userData) {
      return NextResponse.json({ error: 'Unauthorized - Invalid token' }, { status: 401 });
    }

    // Verify the user has access to this school
    const user = await prisma.user.findUnique({
      where: { id: userData.userId },
      include: { school: true }
    });

    if (!user || user.schoolId !== params.schoolId) {
      return NextResponse.json({ error: 'Unauthorized - Wrong school' }, { status: 401 });
    }

    // Get all users for the school
    const users = await prisma.user.findMany({
      where: {
        schoolId: params.schoolId,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users: ' + (error.message || 'Unknown error') },
      { status: 500 }
    );
  }
}

// POST /api/schools/[schoolId]/users - Create a new user for a specific school
export async function POST(
  req: Request,
  { params }: { params: { schoolId: string } }
) {
  try {
    console.log('Received request to create user'); // Debug log
    console.log('School ID from params:', params.schoolId);

    // Get token from cookie
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      console.log('No token found in cookies');
      return NextResponse.json({ error: 'Unauthorized - No token' }, { status: 401 });
    }

    const userData = await verifyAuth(token);
    console.log('Verified user data:', userData); // Debug log

    if (!userData) {
      console.log('Invalid token');
      return NextResponse.json({ error: 'Unauthorized - Invalid token' }, { status: 401 });
    }

    // Verify the user is a school admin for this school
    const admin = await prisma.user.findUnique({
      where: { id: userData.userId },
      include: { school: true }
    });

    console.log('Admin user:', admin); // Debug log

    if (!admin) {
      console.log('Admin not found');
      return NextResponse.json({ error: 'Unauthorized - Admin not found' }, { status: 401 });
    }

    if (!params.schoolId) {
      console.log('School ID is missing from params');
      return NextResponse.json({ error: 'School ID is required' }, { status: 400 });
    }

    if (admin.schoolId !== params.schoolId) {
      console.log('School ID mismatch', { adminSchoolId: admin.schoolId, requestedSchoolId: params.schoolId });
      return NextResponse.json({ error: 'Unauthorized - Wrong school' }, { status: 401 });
    }

    if (admin.role !== 'schooladmin') {
      console.log('Not a school admin', { role: admin.role });
      return NextResponse.json({ error: 'Unauthorized - Not a school admin' }, { status: 401 });
    }

    const requestData = await req.json();
    console.log('Request data:', requestData); // Debug log

    const { name, email, password, role } = requestData;

    if (!name || !email || !password || !role) {
      console.log('Missing required fields', { name, email, password, role });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate role
    const allowedRoles = ['student', 'teacher', 'schooladmin'];
    if (!allowedRoles.includes(role)) {
      console.log('Invalid role', { role, allowedRoles });
      return NextResponse.json(
        { error: `Invalid role: ${role}. Allowed roles are: ${allowedRoles.join(', ')}` },
        { status: 400 }
      );
    }

    // Check if email is already in use
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log('Email already in use', { email });
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get power level based on role
    const powerLevel = {
      'student': 2,
      'teacher': 3,
      'schooladmin': 4,
    }[role] || 2;

    console.log('Creating user with power level:', powerLevel); // Debug log

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        powerLevel,
        schoolId: params.schoolId
      }
    });

    console.log('User created:', { id: user.id, name: user.name, role: user.role }); // Debug log

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error('Failed to create user:', error);
    return NextResponse.json(
      { error: 'Failed to create user: ' + (error.message || 'Unknown error') },
      { status: 500 }
    );
  }
}

// DELETE /api/schools/[schoolId]/users/[userId] - Delete a user from a specific school
export async function DELETE(
  req: Request,
  { params }: { params: { schoolId: string; userId: string } }
) {
  try {
    if (!params.schoolId || !params.userId) {
      return NextResponse.json({ error: 'School ID and User ID are required' }, { status: 400 });
    }

    // Get token from cookie
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized - No token' }, { status: 401 });
    }

    const userData = await verifyAuth(token);
    if (!userData) {
      return NextResponse.json({ error: 'Unauthorized - Invalid token' }, { status: 401 });
    }

    // Verify the user is a school admin for this school
    const admin = await prisma.user.findUnique({
      where: { id: userData.userId },
      include: { school: true }
    });

    if (!admin || admin.schoolId !== params.schoolId || admin.role !== 'schooladmin') {
      return NextResponse.json({ error: 'Unauthorized - Not authorized' }, { status: 401 });
    }

    // Delete user
    await prisma.user.delete({
      where: {
        id: params.userId,
        schoolId: params.schoolId // Ensure user belongs to this school
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user: ' + (error.message || 'Unknown error') },
      { status: 500 }
    );
  }
}
