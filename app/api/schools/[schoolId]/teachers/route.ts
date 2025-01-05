import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

// GET /api/schools/[schoolId]/teachers - Get all teachers for a specific school
export async function GET(
  req: Request,
  { params }: { params: { schoolId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has access to this school
    if (session.user.role !== 'SUPERADMIN' && session.user.schoolId !== params.schoolId) {
      return NextResponse.json({ error: 'Unauthorized access to school data' }, { status: 403 });
    }

    // Get all teachers for the school
    const teachers = await prisma.user.findMany({
      where: {
        schoolId: params.schoolId,
        role: 'TEACHER'
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
        teachingClasses: {
          select: {
            id: true,
            name: true,
            students: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        _count: {
          select: {
            teachingClasses: true,
            assignments: true
          }
        }
      }
    });

    return NextResponse.json(teachers);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teachers' },
      { status: 500 }
    );
  }
}

// POST /api/schools/[schoolId]/teachers - Create a new teacher
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
    const { name, email } = data;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    // Check if email is already in use
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }

    // Hash password (using email as initial password)
    const hashedPassword = await bcrypt.hash(email, 10);

    const newTeacher = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'TEACHER',
        powerLevel: 2,
        status: 'ACTIVE',
        school: {
          connect: {
            id: params.schoolId
          }
        },
        ...data.subjects && { subjects: data.subjects },
        ...data.education && { education: data.education },
        ...data.experience && { experience: data.experience },
        ...data.phoneNumber && { phoneNumber: data.phoneNumber },
        ...data.officeHours && { officeHours: data.officeHours },
        ...data.bio && { bio: data.bio }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        subjects: true,
        education: true,
        experience: true
      }
    });

    return NextResponse.json(newTeacher, { status: 201 });
  } catch (error) {
    console.error('Error creating teacher:', error);
    return NextResponse.json(
      { error: 'Failed to create teacher' },
      { status: 500 }
    );
  }
}

// DELETE /api/schools/[schoolId]/teachers/[teacherId] - Delete a teacher
export async function DELETE(
  req: Request,
  { params }: { params: { schoolId: string; teacherId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete the teacher
    await prisma.user.delete({
      where: {
        id: params.teacherId,
        schoolId: params.schoolId,
        role: 'TEACHER'
      }
    });

    return NextResponse.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    return NextResponse.json(
      { error: 'Failed to delete teacher' },
      { status: 500 }
    );
  }
}
