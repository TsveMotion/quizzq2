import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

export async function PATCH(
  req: Request,
  { params }: { params: { schoolId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session?.user?.role !== 'SUPERADMIN') {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized - Requires SUPERADMIN role' }), 
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const { name, description } = body;

    if (!name) {
      return new NextResponse(
        JSON.stringify({ error: 'Name is required' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const school = await prisma.school.update({
      where: {
        id: params.schoolId,
      },
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(school);
  } catch (error) {
    console.error('Error updating school:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to update school' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { schoolId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session?.user?.role !== 'SUPERADMIN') {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized - Requires SUPERADMIN role' }), 
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Delete all users associated with the school
    await prisma.user.deleteMany({
      where: {
        schoolId: params.schoolId,
      },
    });

    // Delete the school
    await prisma.school.delete({
      where: {
        id: params.schoolId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting school:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to delete school' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
