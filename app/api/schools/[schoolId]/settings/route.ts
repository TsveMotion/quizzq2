import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';

// GET /api/schools/[schoolId]/settings - Get school settings
export async function GET(
  req: Request,
  { params }: { params: { schoolId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const school = await prisma.school.findUnique({
      where: { id: params.schoolId },
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
    });

    if (!school) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }

    return NextResponse.json(school);
  } catch (error) {
    console.error('Error fetching school settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch school settings' },
      { status: 500 }
    );
  }
}

// PATCH /api/schools/[schoolId]/settings - Update school settings
export async function PATCH(
  req: Request,
  { params }: { params: { schoolId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { name } = data;

    const updatedSchool = await prisma.school.update({
      where: { id: params.schoolId },
      data: {
        name,
      },
    });

    return NextResponse.json(updatedSchool);
  } catch (error) {
    console.error('Error updating school settings:', error);
    return NextResponse.json(
      { error: 'Failed to update school settings' },
      { status: 500 }
    );
  }
}
