import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/schools/[schoolId]/users - Get all users for a specific school
export async function GET(
  req: Request,
  { params }: { params: { schoolId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session in API:', session);
    console.log('Requested school ID:', params.schoolId);

    if (!session?.user) {
      console.error('No session user found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the current user with their school info
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        school: true
      }
    });

    console.log('Current user in API:', currentUser);

    if (!currentUser) {
      console.error('User not found in database');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has access to this school
    if (currentUser.role !== 'superadmin' && currentUser.schoolId !== params.schoolId) {
      console.error('User does not have access to this school', {
        userSchoolId: currentUser.schoolId,
        requestedSchoolId: params.schoolId,
        userRole: currentUser.role
      });
      return NextResponse.json({ error: 'Unauthorized access to school data' }, { status: 403 });
    }

    console.log('Fetching users for school:', params.schoolId);

    // Get all users for the school
    const users = await prisma.user.findMany({
      where: {
        schoolId: params.schoolId
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        powerLevel: true,
        createdAt: true,
        updatedAt: true,
        school: {
          select: {
            id: true,
            name: true
          }
        },
        teacherOf: {
          select: {
            id: true,
            name: true,
            students: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true
              }
            }
          }
        },
        enrolledIn: {
          select: {
            id: true,
            name: true,
            teacher: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true
              }
            }
          }
        },
        _count: {
          select: {
            teacherOf: true,
            enrolledIn: true,
            submissions: true
          }
        }
      }
    });

    console.log('Found users:', users.length);
    console.log('Users by role:');
    console.log('- Students:', users.filter(u => u.role === 'student').length);
    console.log('- Teachers:', users.filter(u => u.role === 'teacher').length);
    console.log('- Admins:', users.filter(u => u.role === 'schooladmin').length);

    const stats = {
      totalStudents: users.filter(u => u.role === 'student').length,
      totalTeachers: users.filter(u => u.role === 'teacher').length,
      totalAdmins: users.filter(u => u.role === 'schooladmin').length,
      activeUsers: users.length,
      totalSubmissions: users.reduce((acc, user) => acc + (user._count?.submissions || 0), 0)
    };

    console.log('Returning response with stats:', stats);
    
    return NextResponse.json({ 
      users,
      stats,
      school: currentUser.school
    });
  } catch (error) {
    console.error('Detailed error in API:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      { error: 'Failed to fetch users', details: error instanceof Error ? error.message : 'Unknown error' },
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
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { name, email, password, role } = data;

    // Verify email is not already taken
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        powerLevel: 1,
        schoolId: params.schoolId,
        createdBy: {
          connect: {
            id: session.user.id
          }
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
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
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      { error: 'Failed to create user', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE /api/schools/[schoolId]/users/[userId] - Delete a user
export async function DELETE(
  req: Request,
  { params }: { params: { schoolId: string; userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete user
    await prisma.user.delete({
      where: { 
        id: params.userId,
        schoolId: params.schoolId
      }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting user:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      { error: 'Failed to delete user', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
