import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const formData = await req.formData();
    const assignmentId = formData.get('assignmentId') as string;
    const answers = JSON.parse(formData.get('answers') as string);
    const comment = formData.get('comment') as string;
    const files = formData.getAll('files') as File[];

    // Validate the assignment exists and belongs to the student
    const assignment = await prisma.assignment.findFirst({
      where: {
        id: assignmentId,
        class: {
          students: {
            some: {
              id: session.user.id
            }
          }
        }
      },
      include: {
        questions: true
      }
    });

    if (!assignment) {
      return new NextResponse('Assignment not found', { status: 404 });
    }

    // Check if submission already exists
    const existingSubmission = await prisma.homeworkSubmission.findFirst({
      where: {
        assignmentId,
        studentId: session.user.id
      }
    });

    if (existingSubmission) {
      return new NextResponse('Assignment already submitted', { status: 400 });
    }

    // Upload files to your storage service (implement this based on your storage solution)
    const fileUrls = await Promise.all(
      files.map(async (file) => {
        // Implement file upload logic here
        // For now, we'll just return a placeholder URL
        return `/uploads/${file.name}`;
      })
    );

    // Create the submission
    const submission = await prisma.homeworkSubmission.create({
      data: {
        assignmentId,
        studentId: session.user.id,
        status: "SUBMITTED",
        content: comment,
        submittedAt: new Date(),
        metadata: fileUrls ? { files: fileUrls } : undefined
      }
    });

    return NextResponse.json(submission);
  } catch (error) {
    console.error('Error submitting assignment:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
