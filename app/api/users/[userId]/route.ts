import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { school: true }
    });

    if (!currentUser || !['superadmin', 'schooladmin'].includes(currentUser.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Get the user to be deleted
    const userToDelete = await prisma.user.findUnique({
      where: { id: params.userId },
      select: {
        id: true,
        schoolId: true,
        role: true
      }
    });

    if (!userToDelete) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // School admin can only delete users from their own school
    if (
      currentUser.role === 'schooladmin' &&
      (userToDelete.schoolId !== currentUser.schoolId || userToDelete.role === 'schooladmin')
    ) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this user' },
        { status: 403 }
      );
    }

    // Delete the user
    await prisma.user.delete({
      where: { id: params.userId }
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

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { school: true }
    });

    if (!currentUser || !['superadmin', 'schooladmin'].includes(currentUser.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const data = await req.json();
    const { name, email, role } = data;

    // Get the user to be updated
    const userToUpdate = await prisma.user.findUnique({
      where: { id: params.userId },
      select: {
        id: true,
        schoolId: true,
        role: true
      }
    });

    if (!userToUpdate) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // School admin can only update users from their own school
    if (
      currentUser.role === 'schooladmin' &&
      (userToUpdate.schoolId !== currentUser.schoolId || userToUpdate.role === 'schooladmin')
    ) {
      return NextResponse.json(
        { error: 'Unauthorized to update this user' },
        { status: 403 }
      );
    }

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id: params.userId },
      data: {
        name,
        email,
        role,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        school: {
          select: {
            id: true,
            name: true
          }
        }
      }
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
