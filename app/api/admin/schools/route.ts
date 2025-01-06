import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

const prisma = new PrismaClient();

// GET /api/admin/schools - Get all schools
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const schools = await prisma.school.findMany({
      include: {
        users: {
          where: {
            role: {
              in: ['teacher', 'student']
            }
          }
        },
        _count: {
          select: {
            users: {
              where: {
                role: 'student'
              }
            }
          }
        }
      }
    });

    return NextResponse.json(schools);
  } catch (error) {
    console.error('Failed to fetch schools:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schools' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/admin/schools - Create a new school
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { name, description } = await req.json();

    const school = await prisma.school.create({
      data: {
        name,
        description,
        roleNumber: Math.random().toString(36).substring(7),
      },
    });

    return NextResponse.json(school);
  } catch (error) {
    console.error('Failed to create school:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create school' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
