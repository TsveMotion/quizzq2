import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

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
    if (currentUser.role !== 'SUPERADMIN' && currentUser.schoolId !== params.schoolId) {
      console.error('User does not have access to this school');
      return NextResponse.json({ error: 'Unauthorized access to school data' }, { status: 403 });
    }

    console.log('Fetching users for school:', params.schoolId);

    // Get all users for the school with their relationships
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
        status: true,
        createdAt: true,
        updatedAt: true,
        avatar: true,
        bio: true,
        subjects: true,
        education: true,
        experience: true,
        phoneNumber: true,
        officeHours: true,
        school: {
          select: {
            id: true,
            name: true
          }
        },
        teachingClasses: {
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
        enrolledClasses: {
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
            teachingClasses: true,
            enrolledClasses: true,
            submissions: true
          }
        }
      }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Detailed error in API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users', message: error instanceof Error ? error.message : 'Unknown error' },
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
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { name, email, role, powerLevel, ...otherData } = data;

    // Hash password (you might want to generate a random password or handle this differently)
    const hashedPassword = await bcrypt.hash(email, 10); // Using email as initial password

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role.toUpperCase(),
        powerLevel: powerLevel || 1,
        schoolId: params.schoolId,
        status: 'ACTIVE',
        ...otherData
      }
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
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
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete the user
    await prisma.user.delete({
      where: {
        id: params.userId,
        schoolId: params.schoolId
      }
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
