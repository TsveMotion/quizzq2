import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// DELETE /api/admin/schools/[schoolId] - Delete a school
export async function DELETE(
  req: Request,
  { params }: { params: { schoolId: string } }
) {
  try {
    // First, update all users associated with this school to remove the school association
    await prisma.user.updateMany({
      where: {
        schoolId: params.schoolId,
      },
      data: {
        schoolId: null,
      },
    });

    // Then delete the school
    await prisma.school.delete({
      where: {
        id: params.schoolId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete school:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to delete school' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PATCH /api/admin/schools/[schoolId] - Update a school
export async function PATCH(
  req: Request,
  { params }: { params: { schoolId: string } }
) {
  try {
    const { name, description } = await req.json();

    const school = await prisma.school.update({
      where: {
        id: params.schoolId,
      },
      data: {
        name,
        description,
      },
    });

    return NextResponse.json({ school });
  } catch (error) {
    console.error('Failed to update school:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update school' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
