import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { hash } from 'bcrypt';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function POST(
  req: Request,
  { params }: { params: { studentId: string } }
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

    const student = await prisma.user.findFirst({
      where: {
        id: params.studentId,
        role: 'student',
        createdBy: {
          id: session.userId,
        },
      },
    });

    if (!student) {
      return new NextResponse('Student not found', { status: 404 });
    }

    // Generate a secure temporary password (12 characters)
    const tempPassword = Math.random().toString(36).slice(-4) + 
                        Math.random().toString(36).slice(-4) + 
                        Math.random().toString(36).slice(-4);
    
    // Hash password with bcrypt (12 rounds)
    const hashedPassword = await hash(tempPassword, 12);

    await prisma.user.update({
      where: {
        id: params.studentId,
      },
      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json({ 
      temporaryPassword: tempPassword,
      message: 'Password reset successfully. Please provide this temporary password to the student.' 
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
