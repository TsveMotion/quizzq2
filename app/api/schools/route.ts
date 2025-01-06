import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if user is superadmin
    const user = await prisma.user.findFirst({
      where: {
        email: session.user.email,
        role: 'SUPERADMIN'
      }
    });

    if (!user) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const body = await req.json();
    const { name, description } = body;

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    // Generate a unique role number
    const roleNumber = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    const school = await prisma.school.create({
      data: {
        name,
        description,
        roleNumber, // Add the required roleNumber field
      },
    });

    return NextResponse.json(school);
  } catch (error) {
    console.error('Error creating school:', error);
    // Return more specific error message
    if (error.code === 'P2002') {
      return new NextResponse('A school with this role number already exists. Please try again.', { status: 400 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if user is superadmin
    const user = await prisma.user.findFirst({
      where: {
        email: session.user.email,
        role: 'SUPERADMIN'
      }
    });

    if (!user) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const schools = await prisma.school.findMany({
      include: {
        users: {
          where: {
            status: 'ACTIVE'
          },
          select: {
            id: true,
            role: true
          }
        }
      }
    });

    // Transform the data to include proper role-based counts
    const transformedSchools = schools.map(school => {
      const users = school.users || [];
      const studentCount = users.filter(user => user.role === 'STUDENT').length;
      const teacherCount = users.filter(user => user.role === 'TEACHER').length;

      return {
        ...school,
        studentCount,
        teacherCount,
        users: undefined // Remove users from the response
      };
    });

    return NextResponse.json(transformedSchools);
  } catch (error) {
    console.error('Error fetching schools:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if user is superadmin
    const user = await prisma.user.findFirst({
      where: {
        email: session.user.email,
        role: 'SUPERADMIN'
      }
    });

    if (!user) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get('id');

    if (!schoolId) {
      return new NextResponse('School ID is required', { status: 400 });
    }

    // Delete all associated records first
    await prisma.$transaction([
      // Update all users to remove schoolId reference
      prisma.user.updateMany({
        where: { schoolId: schoolId },
        data: { schoolId: null }
      }),
      // Finally delete the school
      prisma.school.delete({
        where: { id: schoolId }
      })
    ]);

    return NextResponse.json({ message: 'School deleted successfully' });
  } catch (error) {
    console.error('Error deleting school:', error);
    if (error.code === 'P2025') {
      return new NextResponse('School not found', { status: 404 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
