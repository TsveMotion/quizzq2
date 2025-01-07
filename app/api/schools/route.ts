import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session?.user?.role !== 'SUPERADMIN') {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized - Requires SUPERADMIN role' }), 
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const { name, description } = body;

    if (!name) {
      return new NextResponse(
        JSON.stringify({ error: 'Name is required' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate a unique role number
    const roleNumber = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    const school = await prisma.school.create({
      data: {
        name,
        description,
        roleNumber,
      },
    });

    return NextResponse.json(school);
  } catch (error) {
    console.error('Error creating school:', error);
    const err = error as { code?: string };
    if (err.code === 'P2002') {
      return new NextResponse(
        JSON.stringify({ error: 'A school with this role number already exists. Please try again.' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session?.user?.role !== 'SUPERADMIN') {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized - Requires SUPERADMIN role' }), 
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Test database connection first
    try {
      await prisma.$connect();
    } catch (error) {
      console.error('Database connection error:', error);
      return new NextResponse(
        JSON.stringify({ error: 'Database connection failed. Please try again later.' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let schools = [];
    try {
      schools = await prisma.school.findMany({
        include: {
          users: {
            select: {
              id: true,
              role: true
            }
          }
        }
      });
    } catch (error) {
      console.error('Error fetching schools:', error);
      return new NextResponse(
        JSON.stringify({ error: 'Failed to fetch schools data' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Transform the data to include counts
    const transformedSchools = schools.map(school => {
      const studentCount = school.users.filter(user => user.role === 'STUDENT').length;
      const teacherCount = school.users.filter(user => user.role === 'TEACHER').length;

      return {
        ...school,
        studentCount,
        teacherCount,
        users: undefined // Remove users array from response
      };
    });

    return NextResponse.json(transformedSchools);
  } catch (error) {
    console.error('Error in schools route:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session?.user?.role !== 'SUPERADMIN') {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized - Requires SUPERADMIN role' }), 
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get('id');

    if (!schoolId) {
      return new NextResponse(
        JSON.stringify({ error: 'School ID is required' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Delete the school
    await prisma.school.delete({
      where: {
        id: schoolId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting school:', error);
    const err = error as { code?: string };
    if (err.code === 'P2025') {
      return new NextResponse(
        JSON.stringify({ error: 'School not found' }), 
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
