import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth-config';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        role: true,
        schoolId: true,
      }
    });

    if (!currentUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    let schoolFilter = {};
    if (currentUser.role === 'SCHOOLADMIN' && currentUser.schoolId) {
      schoolFilter = {
        user: {
          schoolId: currentUser.schoolId
        }
      };
    }

    // Get the last 6 months of activity
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Get monthly activity counts
    const monthlyActivity = await prisma.userActivity.groupBy({
      by: ['timestamp'],
      where: {
        timestamp: {
          gte: sixMonthsAgo
        },
        ...schoolFilter,
        userId: session.user.id,
      },
      _count: {
        id: true
      }
    });

    // Process the data into monthly counts
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = new Array(6).fill(0);
    const currentMonth = new Date().getMonth();

    monthlyActivity.forEach((activity: { timestamp: Date | string; _count: { id: number } }) => {
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
