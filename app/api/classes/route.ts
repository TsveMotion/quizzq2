import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function GET() {
  try {
    const token = cookies().get('token')?.value;
    
    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const session = await verifyAuth(token);
    
    if (!session || session.role !== 'teacher') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const classes = await prisma.class.findMany({
      where: {
        teacherId: session.userId,
      },
      include: {
        students: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const token = cookies().get('token')?.value;
    
    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const session = await verifyAuth(token);
    
    if (!session || session.role !== 'teacher') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { name, description } = await req.json();

    if (!name) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const newClass = await prisma.class.create({
      data: {
        name,
        description,
        teacherId: session.userId,
        schoolId: session.schoolId!,
      },
      include: {
        students: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(newClass);
  } catch (error) {
    console.error('Error creating class:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
