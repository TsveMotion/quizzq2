import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

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

    // Get current date and first day of current month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get total counts
    const [
      totalUsers,
      totalSchools,
      totalStudents,
      totalTeachers,
      newUsersThisMonth,
      newSchoolsThisMonth,
      usersByRole,
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      
      // Total schools
      prisma.school.count(),
      
      // Total students
      prisma.user.count({
        where: { role: 'STUDENT' },
      }),
      
      // Total teachers
      prisma.user.count({
        where: { role: 'TEACHER' },
      }),
      
      // New users this month
      prisma.user.count({
        where: {
          createdAt: {
            gte: firstDayOfMonth,
          },
        },
      }),
      
      // New schools this month
      prisma.school.count({
        where: {
          createdAt: {
            gte: firstDayOfMonth,
          },
        },
      }),
      
      // Users by role
      prisma.user.groupBy({
        by: ['role'],
        _count: {
          id: true,
        },
      }),
    ]);

    // Transform usersByRole data
    const usersByRoleFormatted = usersByRole.map((item) => ({
      role: item.role,
      count: item._count.id,
    }));

    // Get users by month (last 12 months)
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

    // Transform usersByMonth data to group by month
    const usersByMonthMap = new Map();
    usersByMonth.forEach((item) => {
      const monthKey = new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      const currentCount = usersByMonthMap.get(monthKey) || 0;
      usersByMonthMap.set(monthKey, currentCount + item._count.id);
    });

    const usersByMonthFormatted = Array.from(usersByMonthMap, ([month, count]) => ({
      month,
      count,
    }));

    return NextResponse.json({
      totalUsers,
      totalSchools,
      totalStudents,
      totalTeachers,
      newUsersThisMonth,
      newSchoolsThisMonth,
      usersByRole: usersByRoleFormatted,
      usersByMonth: usersByMonthFormatted,
    });
  } catch (error) {
    console.error('Error fetching overview stats:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}
