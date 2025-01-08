import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { endOfDay, startOfDay, subDays } from 'date-fns';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session data:', session?.user);
    
    if (!session?.user?.email || session?.user?.role !== 'SCHOOLADMIN' || !session?.user?.schoolId) {
      return NextResponse.json(
        { error: 'Unauthorized - Requires SCHOOLADMIN role' }, 
        { status: 401 }
      );
    }

    const schoolId = session.user.schoolId;
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(today, i);
      return {
        date: startOfDay(date),
        nextDate: endOfDay(date),
      };
    });

    // Get assignments for the last 7 days
    const assignments = await prisma.assignment.findMany({
      where: {
        class: {
          schoolId: schoolId
        },
        status: 'PUBLISHED',
        createdAt: {
          gte: last7Days[6].date,
          lte: last7Days[0].nextDate,
        },
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    // Count assignments per day
    const activityData = last7Days.map(({ date, nextDate }) => {
      const count = assignments.filter(
        assignment => 
          assignment.createdAt >= date &&
          assignment.createdAt <= nextDate
      ).length;

      return {
        date: date.toISOString().split('T')[0],
        count,
      };
    }).reverse();

    return NextResponse.json(activityData);
  } catch (error) {
    console.error('Error fetching activity stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity stats' },
      { status: 500 }
    );
  }
}
