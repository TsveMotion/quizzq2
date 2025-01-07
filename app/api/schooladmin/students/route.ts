import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { hash } from 'bcrypt';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session?.user?.role !== 'SCHOOLADMIN' || !session?.user?.schoolId) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized - Requires SCHOOLADMIN role' }), 
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const schoolId = session.user.schoolId;

    const students = await prisma.user.findMany({
      where: {
        schoolId: schoolId,
        role: 'STUDENT',
      },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        createdAt: true,
        enrolledClasses: {
          select: {
            id: true,
            name: true,
          }
        },
        _count: {
          select: {
            enrolledClasses: true,
            submissions: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return new NextResponse(JSON.stringify(students), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch students' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session?.user?.role !== 'SCHOOLADMIN' || !session?.user?.schoolId) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized - Requires SCHOOLADMIN role' }), 
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const { name, email, password, classIds } = body;

    if (!name || !email || !password) {
      return new NextResponse(
        JSON.stringify({ error: 'Name, email, and password are required' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return new NextResponse(
        JSON.stringify({ error: 'Email already exists' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create student
    const student = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'STUDENT',
        status: 'ACTIVE',
        schoolId: session.user.schoolId,
        enrolledClasses: classIds ? {
          connect: classIds.map((id: string) => ({ id }))
        } : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        schoolId: true,
        enrolledClasses: {
          select: {
            id: true,
            name: true,
          }
        },
      },
    });

    return new NextResponse(JSON.stringify(student), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating student:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to create student' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
