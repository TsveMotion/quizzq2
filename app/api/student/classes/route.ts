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
    
    if (!session || session.role !== 'student') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get all classes the student is enrolled in, including assignments
    const classes = await prisma.class.findMany({
      where: {
        students: {
          some: {
            id: session.userId
          }
        }
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        assignments: {
          include: {
            questions: true,
            submissions: {
              where: {
                studentId: session.userId
              }
            }
          }
        }
      }
    });

    return NextResponse.json(classes);
  } catch (error) {
    console.error('Error fetching student classes:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
