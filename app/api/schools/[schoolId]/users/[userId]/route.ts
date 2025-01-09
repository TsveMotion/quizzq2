import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

// PATCH /api/schools/[schoolId]/users/[userId] - Update a user
export async function PATCH(
  req: Request,
  { params }: { params: { schoolId: string; userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the current user with their school info
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { school: true }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has access to this school
    if (currentUser.role !== Role.SUPERADMIN && currentUser.schoolId !== params.schoolId) {
      return NextResponse.json(
        { error: 'Unauthorized access to school data' },
        { status: 403 }
      );
    }

    const data = await req.json();
    const { name, email, role } = data;

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: params.userId },
      data: {
        name,
        email,
        role,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE /api/schools/[schoolId]/users/[userId] - Delete a user
export async function DELETE(
  req: Request,
  { params }: { params: { schoolId: string; userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the current user with their school info
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { school: true }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has access to this school
    if (currentUser.role !== Role.SUPERADMIN && currentUser.schoolId !== params.schoolId) {
      return NextResponse.json(
        { error: 'Unauthorized access to school data' },
        { status: 403 }
      );
    }

    // Delete user
    await prisma.user.delete({
      where: { id: params.userId },
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
