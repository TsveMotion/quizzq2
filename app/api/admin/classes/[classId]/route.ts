import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

type Context = {
  params: {
    classId: string;
  };
};

export async function GET(request: Request, context: Context) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const classData = await prisma.class.findUnique({
      where: { id: context.params.classId },
      include: {
        students: true,
        teacher: true,
      },
    });

    if (!classData) {
      return new Response(JSON.stringify({ error: 'Class not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(classData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching class:', error);
    return new Response(JSON.stringify({ error: 'Error fetching class' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PATCH(request: Request, context: Context) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await request.json();
    const updatedClass = await prisma.class.update({
      where: { id: context.params.classId },
      data,
    });

    return new Response(JSON.stringify(updatedClass), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating class:', error);
    return new Response(JSON.stringify({ error: 'Error updating class' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(request: Request, context: Context) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await prisma.class.delete({
      where: { id: context.params.classId },
    });

    return new Response(JSON.stringify({ message: 'Class deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting class:', error);
    return new Response(JSON.stringify({ error: 'Error deleting class' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
