import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session:', session); // Debug log
    
    if (!session || session.user.role !== 'superadmin') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { name, address } = body;

    if (!name || !address) {
      return new NextResponse('Name and address are required', { status: 400 });
    }

    const school = await prisma.school.create({
      data: {
        name,
        roleNumber: Math.random().toString(36).substring(2, 15), // Generate a random role number
        description: address, // Store address in the description field for now
      },
    });

    return NextResponse.json(school);
  } catch (error) {
    console.error('Error creating school:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'superadmin') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const schools = await prisma.school.findMany({
      include: {
        users: true,
      },
    });

    return NextResponse.json(schools);
  } catch (error) {
    console.error('Error fetching schools:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'superadmin') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get('id');

    if (!schoolId) {
      return new NextResponse('School ID is required', { status: 400 });
    }

    await prisma.school.delete({
      where: {
        id: schoolId,
      },
    });

    return new NextResponse('School deleted successfully');
  } catch (error) {
    console.error('Error deleting school:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
