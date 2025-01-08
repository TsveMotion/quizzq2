import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { format } from 'date-fns';
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || session?.user?.role !== 'SUPERADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Requires SUPERADMIN role' }, 
        { status: 401 }
      );
    }

    // Get current date and first day of current month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Initialize stats object with proper typing
    const stats = {
      totalUsers: 0,
      totalSchools: 0,
      totalTeachers: 0,
      totalStudents: 0,
      newUsersThisMonth: 0,
      newSchoolsThisMonth: 0,
      usersByRole: [] as Array<{ role: string; count: number }>,
      usersByMonth: [] as Array<{ month: string; count: number }>
    };

    try {
      // Get main stats one by one to isolate errors
      stats.totalUsers = await prisma.user.count();
      stats.totalSchools = await prisma.school.count();
      stats.totalStudents = await prisma.user.count({
        where: { role: 'STUDENT' },
      });
      stats.totalTeachers = await prisma.user.count({
        where: { role: 'TEACHER' },
      });
      stats.newUsersThisMonth = await prisma.user.count({
        where: {
          createdAt: {
            gte: firstDayOfMonth,
          },
        },
      });
      stats.newSchoolsThisMonth = await prisma.school.count({
        where: {
          createdAt: {
            gte: firstDayOfMonth,
          },
        },
      });

      // Get users by role
      const usersByRole = await prisma.user.groupBy({
        by: ['role'],
        _count: {
          id: true,
        },
      });

      stats.usersByRole = usersByRole.map(item => ({
        role: item.role,
        count: item._count.id,
      }));

      // Get users by month (last 6 months)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const usersByMonth = await prisma.user.groupBy({
        by: ['createdAt'],
        where: {
          createdAt: {
            gte: sixMonthsAgo,
          },
        },
        _count: {
          id: true,
        },
      });

      // Transform date data into months
      const monthCounts = new Map<string, number>();
      usersByMonth.forEach(item => {
        const monthKey = format(new Date(item.createdAt), 'MMM yyyy');
        monthCounts.set(monthKey, (monthCounts.get(monthKey) || 0) + item._count.id);
      });

      stats.usersByMonth = Array.from(monthCounts.entries()).map(([month, count]) => ({
        month,
        count,
      }));

      return NextResponse.json(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      
      // Handle specific Prisma errors
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P1001') {
          return NextResponse.json(
            { error: 'Database connection error. Please check your database configuration.' },
            { status: 503 }
          );
        }
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch statistics. Please try again later.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in stats overview:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
