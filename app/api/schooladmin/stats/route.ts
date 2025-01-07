import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { School, User, Class } from '@prisma/client';

interface SchoolWithRelations extends School {
  users: User[];
  classes: (Class & {
    _count: {
      assignments: number;
    };
  })[];
  _count: {
    users: number;
    classes: number;
  };
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.role || session.user.role !== 'SCHOOLADMIN' || !session?.user?.schoolId) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized - Requires SCHOOLADMIN role' }), 
        { status: 401 }
      );
    }

    const school = await prisma.school.findUnique({
      where: { id: session.user.schoolId },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
          }
        },
        classes: {
          include: {
            _count: {
              select: {
                assignments: true,
              }
            }
          }
        },
        _count: {
          select: {
            users: true,
            classes: true,
          }
        }
      }
    }) as SchoolWithRelations | null;

    if (!school) {
      return new NextResponse(
        JSON.stringify({ error: 'School not found' }), 
        { status: 404 }
      );
    }

    const today = new Date();
    const lastMonth = subMonths(today, 1);
    const startOfLastMonth = startOfMonth(lastMonth);
    const endOfLastMonth = endOfMonth(lastMonth);

    const totalAssignments = school.classes.reduce((sum: number, cls) => 
      sum + (cls._count?.assignments || 0), 0
    );

    const stats = {
      overview: {
        newUsers: school.users.filter((user: User) => {
          const userCreatedAt = new Date(user.createdAt);
          return userCreatedAt >= startOfLastMonth && userCreatedAt <= endOfLastMonth;
        }).length,
        totalAssignments,
      },
      counts: {
        teachers: school.users.filter((user: User) => user.role === 'TEACHER').length,
        students: school.users.filter((user: User) => user.role === 'STUDENT').length,
        classes: school._count.classes,
      },
      classesOverview: school.classes.map((cls) => ({
        id: cls.id,
        name: cls.name,
        assignmentCount: cls._count?.assignments || 0,
      }))
    };

    return new NextResponse(JSON.stringify(stats), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching school stats:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch school stats' }), 
      { status: 500 }
    );
  }
}
