import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session?.user?.role !== 'SCHOOLADMIN' || !session?.user?.schoolId) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized - Requires SCHOOLADMIN role' }), 
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const teacherId = params.id;

    // Verify the teacher belongs to the school admin's school
    const teacher = await prisma.user.findFirst({
      where: {
        id: teacherId,
        schoolId: session.user.schoolId,
        role: 'TEACHER',
      },
    });

    if (!teacher) {
      return new NextResponse(
        JSON.stringify({ error: 'Teacher not found or not authorized to delete' }), 
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Delete the teacher
    await prisma.user.delete({
      where: {
        id: teacherId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to delete teacher' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
