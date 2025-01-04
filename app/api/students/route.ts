import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { hash } from 'bcrypt';
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

    const teacher = await prisma.user.findUnique({
      where: { 
        id: session.userId,
      },
      select: {
        students: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(teacher?.students || []);
  } catch (error) {
    console.error('Error fetching students:', error);
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

    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Check if email is already in use
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse('Email already in use', { status: 400 });
    }

    // Hash password with bcrypt (12 rounds)
    const hashedPassword = await hash(password, 12);

    const student = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'student',
        school: {
          connect: {
            id: session.schoolId,
          },
        },
        createdBy: {
          connect: {
            id: session.userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json(student);
  } catch (error) {
    console.error('Error creating student:', error);
    if (error.code === 'P2002') {
      return new NextResponse('Email already in use', { status: 400 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
