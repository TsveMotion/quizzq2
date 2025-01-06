import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { assignmentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const formData = await request.formData();
    const content = formData.get('content') as string;
    const files = formData.getAll('files') as File[];

    // Here you would handle file uploads to your storage service
    // For now, we'll just store the content
    const submission = await prisma.submission.create({
      data: {
        content,
        studentId: session.user.id,
        assignmentId: params.assignmentId,
        submittedAt: new Date(),
      },
    });

    return NextResponse.json(submission);
  } catch (error) {
    console.error('Error submitting assignment:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
