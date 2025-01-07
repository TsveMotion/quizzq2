import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session?.user?.role !== 'SUPERADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Requires SUPERADMIN role' }, 
        { status: 401 }
      );
    }

    // Test database connection first
    try {
      await prisma.$connect();
    } catch (error) {
      console.error('Database connection error:', error);
      return NextResponse.json(
        { error: 'Database connection failed. Please try again later.' },
        { status: 503 }
      );
    }

    // Get current date and first day of current month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Initialize stats object with proper typing
    const stats: {
      totalUsers: number;
      totalSchools: number;
      totalTeachers: number;
      totalStudents: number;
      newUsersThisMonth: number;
      newSchoolsThisMonth: number;
      usersByRole: Array<{ role: string; count: number }>;
      usersByMonth: Array<{ month: string; count: number }>;
    } = {
      totalUsers: 0,
      totalSchools: 0,
      totalTeachers: 0,
      totalStudents: 0,
      newUsersThisMonth: 0,
      newSchoolsThisMonth: 0,
      usersByRole: [],
      usersByMonth: []
    };

    try {
      // Get main stats
      const results = await Promise.all([
        prisma.user.count(),
        prisma.school.count(),
        prisma.user.count({
          where: { role: 'STUDENT' },
        }),
        prisma.user.count({
          where: { role: 'TEACHER' },
        }),
        prisma.user.count({
          where: {
            createdAt: {
              gte: firstDayOfMonth,
            },
          },
        }),
        prisma.school.count({
          where: {
            createdAt: {
              gte: firstDayOfMonth,
            },
          },
        }),
        prisma.user.groupBy({
          by: ['role'],
          _count: {
            id: true,
          },
        }),
      ]);

      // Assign results to stats object
      [
        stats.totalUsers,
        stats.totalSchools,
        stats.totalStudents,
        stats.totalTeachers,
        stats.newUsersThisMonth,
        stats.newSchoolsThisMonth,
      ] = results;

      // Transform users by role data
      const usersByRole = results[6];
      stats.usersByRole = usersByRole.map((item) => ({
        role: item.role,
        count: item._count.id,
      }));
    } catch (error) {
      console.error('Error fetching main stats:', error);
      // Continue with default values
    }

    // Get users by month in a separate try-catch
    try {
      const monthsAgo = new Date();
      monthsAgo.setMonth(monthsAgo.getMonth() - 11);
      monthsAgo.setDate(1);
      monthsAgo.setHours(0, 0, 0, 0);

      const usersByMonth = await prisma.user.groupBy({
        by: ['createdAt'],
        where: {
          createdAt: {
            gte: monthsAgo,
          },
        },
        _count: {
          id: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      stats.usersByMonth = usersByMonth.map((item) => ({
        month: format(item.createdAt, 'MMM yyyy'),
        count: item._count.id,
      }));
    } catch (error) {
      console.error('Error fetching users by month:', error);
      // Continue with default empty array
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error in overview stats route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
