import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// DELETE /api/admin/users/[userId] - Delete a user
export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    await prisma.user.delete({
      where: {
        id: params.userId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/users/[userId] - Update a user
export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { name, email } = await req.json();

    const user = await prisma.user.update({
      where: {
        id: params.userId,
      },
      data: {
        name,
        email,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Failed to update user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
