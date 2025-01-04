import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateRoleNumber } from '@/lib/utils';

const prisma = new PrismaClient();

// GET /api/admin/schools - Get all schools
export async function GET() {
  try {
    const schools = await prisma.school.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ schools });
  } catch (error) {
    console.error('Failed to fetch schools:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schools' },
      { status: 500 }
    );
  }
}

// POST /api/admin/schools - Create a new school
export async function POST(req: Request) {
  try {
    const { name, description } = await req.json();
    const roleNumber = generateRoleNumber(); // Generate a unique role number

    const school = await prisma.school.create({
      data: {
        name,
        description,
        roleNumber,
      },
    });

    return NextResponse.json({ school }, { status: 201 });
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
