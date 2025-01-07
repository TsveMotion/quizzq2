import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// GET /api/schools/[schoolId]/students - Get all students for a specific school
export async function GET(
  request: Request,
  { params }: { params: { schoolId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.role || session.user.role !== 'SCHOOLADMIN' || !session?.user?.schoolId) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized - Requires SCHOOLADMIN role' }), 
        { status: 401 }
      );
    }

    const schoolId = params.schoolId;

    // Verify the school ID matches the admin's school
    if (schoolId !== session.user.schoolId) {
      return new NextResponse("Unauthorized - School ID mismatch", { status: 401 });
    }

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
            teacher: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
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

    return NextResponse.json(students);
  } catch (error) {
    console.error("[STUDENTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// POST /api/schools/[schoolId]/students - Create a new student
export async function POST(
  request: Request,
  { params }: { params: { schoolId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.role || session.user.role !== 'SCHOOLADMIN' || !session?.user?.schoolId) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized - Requires SCHOOLADMIN role' }), 
        { status: 401 }
      );
    }

    const schoolId = params.schoolId;

    // Verify the school ID matches the admin's school
    if (schoolId !== session.user.schoolId) {
      return new NextResponse("Unauthorized - School ID mismatch", { status: 401 });
    }

    const body = await request.json();
    const { name, email, password, classIds } = body;

    if (!name || !email) {
      return new NextResponse("Name and email are required", { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return new NextResponse("User with this email already exists", { status: 400 });
    }

    // Set default password as email if not provided
    const passwordToUse = password || email;
    const hashedPassword = await bcrypt.hash(passwordToUse, 10);

    // Prepare class connections if classIds are provided
    const classConnections = classIds?.length > 0 ? {
      connect: classIds.map((id: string) => ({ id }))
    } : undefined;

    // Create the student
    const student = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'STUDENT',
        schoolId,
        status: 'ACTIVE',
        powerLevel: 1,
        enrolledClasses: classConnections,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        schoolId: true,
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
          }
        }
      }
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error("[STUDENTS_POST]", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal error",
      { status: 500 }
    );
  }
}

// DELETE /api/schools/[schoolId]/students/[studentId] - Delete a student
export async function DELETE(
  req: Request,
  { params }: { params: { schoolId: string; studentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.role || session.user.role !== 'SCHOOLADMIN' || !session?.user?.schoolId) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized - Requires SCHOOLADMIN role' }), 
        { status: 401 }
      );
    }

    // Verify the school ID matches the admin's school
    if (params.schoolId !== session.user.schoolId) {
      return new NextResponse("Unauthorized - School ID mismatch", { status: 401 });
    }

    // Delete the student
    await prisma.user.delete({
      where: {
        id: params.studentId,
        schoolId: params.schoolId,
        role: 'STUDENT', // Extra safety check
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[STUDENTS_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
