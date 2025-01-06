import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth-config';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the last 6 months of activity
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    let schoolId: string | undefined;
    
    // If user is a school admin, get their school's activity
    if (session.user.role === 'SCHOOLADMIN') {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { schoolId: true }
      });
      schoolId = user?.schoolId;
    }

    // Get monthly activity counts
    const monthlyActivity = await prisma.userActivity.groupBy({
      by: ['timestamp'],
      where: {
        timestamp: {
          gte: sixMonthsAgo
        },
        ...(schoolId && {
          user: {
            schoolId: schoolId
          }
        })
      },
      _count: {
        id: true
      }
    });

    // Process the data into monthly counts
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = new Array(6).fill(0);
    const currentMonth = new Date().getMonth();

    monthlyActivity.forEach((activity) => {
      const activityMonth = new Date(activity.timestamp).getMonth();
      const monthIndex = (activityMonth - currentMonth + 12) % 12;
      if (monthIndex < 6) {
        monthlyData[5 - monthIndex] = activity._count.id;
      }
    });

    // Get the labels for the last 6 months
    const labels = Array.from({ length: 6 }, (_, i) => {
      const monthIndex = (currentMonth - 5 + i + 12) % 12;
      return months[monthIndex];
    });

    return NextResponse.json({
      labels,
      data: monthlyData
    });
  } catch (error) {
    console.error('Error fetching activity stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity stats' },
      { status: 500 }
    );
  }
}
