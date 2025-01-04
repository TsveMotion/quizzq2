import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function POST(
  req: Request,
  { params }: { params: { assignmentId: string } }
) {
  try {
    const token = cookies().get('token')?.value;
    
    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const session = await verifyAuth(token);
    
    if (!session || session.role !== 'student') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { content } = await req.json();

    if (!content) {
      return new NextResponse('Missing submission content', { status: 400 });
    }

    // Check if student is enrolled in the class
    const assignment = await prisma.assignment.findFirst({
      where: {
        id: params.assignmentId,
        class: {
          students: {
            some: {
              id: session.userId
            }
          }
        }
      }
    });

    if (!assignment) {
      return new NextResponse('Assignment not found or not enrolled in class', { status: 404 });
    }

    // Create or update submission
    const submission = await prisma.homeworkSubmission.upsert({
      where: {
        studentId_assignmentId: {
          studentId: session.userId,
          assignmentId: params.assignmentId
        }
      },
      update: {
        content,
      },
      create: {
        content,
        student: {
          connect: {
            id: session.userId
          }
        },
        assignment: {
          connect: {
            id: params.assignmentId
          }
        }
      }
    });

    return NextResponse.json(submission);
  } catch (error) {
    console.error('Error submitting homework:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
