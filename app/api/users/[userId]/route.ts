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
    console.log('Delete request session:', session?.user);
    
    if (!session?.user?.email) {
      console.log('No session user found');
      return NextResponse.json({ error: 'Unauthorized - Not logged in' }, { status: 401 });
    }

    // First verify if the current user exists and is a SUPERADMIN
    const currentUser = await prisma.user.findFirst({
      where: {
        email: session.user.email,
        role: 'SUPERADMIN'
      },
      select: {
        id: true,
        role: true
      }
    });

    if (!currentUser) {
      console.log('User not found or not SUPERADMIN:', session.user.email);
      return NextResponse.json({ error: 'Unauthorized - Must be SUPERADMIN' }, { status: 403 });
    }

    // Get the user to be deleted
    const userToDelete = await prisma.user.findUnique({
      where: { id: params.userId }
    });

    if (!userToDelete) {
      return NextResponse.json({ error: 'User to delete not found' }, { status: 404 });
    }

    // Delete the user
    await prisma.user.delete({
      where: { id: params.userId }
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user: ' + (error instanceof Error ? error.message : 'Unknown error') },
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
    console.log('Patch request session:', session?.user);
    
    if (!session?.user?.email) {
      console.log('No session user found');
      return NextResponse.json({ error: 'Unauthorized - Not logged in' }, { status: 401 });
    }

    // First verify if the current user exists and is a SUPERADMIN
    const currentUser = await prisma.user.findFirst({
      where: {
        email: session.user.email,
        role: 'SUPERADMIN'
      },
      select: {
        id: true,
        role: true
      }
    });

    if (!currentUser) {
      console.log('User not found or not SUPERADMIN:', session.user.email);
      return NextResponse.json({ error: 'Unauthorized - Must be SUPERADMIN' }, { status: 403 });
    }

    const data = await req.json();
    console.log('Update data:', data);

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id: params.userId },
      data: {
        name: data.name,
        email: data.email,
        role: data.role,
        schoolId: data.schoolId === 'none' ? null : data.schoolId,
        status: data.status,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}
