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
    const startDate = sixMonthsAgo;
    const endDate = new Date();

    // Get monthly activity counts
    const monthlyActivity = await prisma.userActivity.groupBy({
      by: ['createdAt'],
      _count: {
        id: true
      },
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        },
        ...schoolFilter,
        userId: session.user.id,
      },
    });

    // Process the data into monthly counts
    const activityByDay: { [key: string]: number } = {};
    monthlyActivity.forEach((activity: { createdAt: Date; _count: { id: number } }) => {
      const date = activity.createdAt.toISOString().split('T')[0];
      activityByDay[date] = (activityByDay[date] || 0) + activity._count.id;
    });

    // Get the labels for the last 6 months
    const labels = Object.keys(activityByDay);
    const data = Object.values(activityByDay);

    return NextResponse.json({
      labels,
      data
    });
  } catch (error) {
    console.error('Error fetching activity stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity stats' },
      { status: 500 }
    );
  }
}
