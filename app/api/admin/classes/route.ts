import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth-config';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get('schoolId');

    if (!schoolId) {
      return new NextResponse('Missing schoolId parameter', { status: 400 });
    }

    const classes = await prisma.class.findMany({
      where: {
        schoolId,
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        classTeachers: {
          include: {
            teacher: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        },
        _count: {
          select: {
            students: true,
            classTeachers: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform the data to include teachers array
    const transformedClasses = classes.map(classObj => ({
      ...classObj,
      teachers: classObj.classTeachers.map(ct => ct.teacher),
      _count: {
        ...classObj._count,
        teachers: classObj._count.classTeachers
      }
    }));

    return NextResponse.json(transformedClasses);
  } catch (error) {
    console.error('[CLASSES_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const json = await req.json();
    const { name, description, schoolId, teacherId, teacherIds = [] } = json;

    if (!name || !schoolId || !teacherId) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const newClass = await prisma.class.create({
      data: {
        name,
        description,
        schoolId,
        teacherId,
        classTeachers: {
          create: [
            { teacherId },
            ...teacherIds.filter((id: string) => id !== teacherId).map((id: string) => ({ teacherId: id }))
          ]
        }
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        classTeachers: {
          include: {
            teacher: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        },
        _count: {
          select: {
            students: true,
            classTeachers: true,
          },
        },
      },
    });

    // Transform the response
    const transformedClass = {
      ...newClass,
      teachers: newClass.classTeachers.map(ct => ct.teacher),
      _count: {
        ...newClass._count,
        teachers: newClass._count.classTeachers
      }
    };

    return NextResponse.json(transformedClass);
  } catch (error) {
    console.error('[CLASSES_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
