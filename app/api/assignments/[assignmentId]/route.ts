import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: { assignmentId: string } }
) {
  try {
    const token = cookies().get('token')?.value;
    
    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const session = await verifyAuth(token);
    
    if (!session || session.role !== 'teacher') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const assignment = await prisma.assignment.findFirst({
      where: {
        id: params.assignmentId,
        teacherId: session.userId,
      },
      include: {
        class: true,
        submissions: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!assignment) {
      return new NextResponse('Assignment not found', { status: 404 });
    }

    return NextResponse.json(assignment);
  } catch (error) {
    console.error('Error fetching assignment:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { assignmentId: string } }
) {
  try {
    const token = cookies().get('token')?.value;
    
    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const session = await verifyAuth(token);
    
    if (!session || session.role !== 'teacher') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Verify the assignment belongs to this teacher
    const assignment = await prisma.assignment.findFirst({
      where: {
        id: params.assignmentId,
        teacherId: session.userId,
      },
    });

    if (!assignment) {
      return new NextResponse('Assignment not found', { status: 404 });
    }

    // Delete the assignment and all related submissions
    await prisma.assignment.delete({
      where: {
        id: params.assignmentId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
