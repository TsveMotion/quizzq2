import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        aiDailyUsage: true,
        aiMonthlyUsage: true,
        aiLifetimeUsage: true,
        aiLastResetDate: true,
        subscriptionPlan: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch AI credits' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Reset daily usage if last reset was yesterday or earlier
    const lastReset = user.aiLastResetDate;
    const now = new Date();
    const shouldResetDaily = !lastReset || new Date(lastReset).getDate() !== now.getDate();

    // Reset monthly usage if last reset was in a different month
    const shouldResetMonthly = !lastReset || new Date(lastReset).getMonth() !== now.getMonth();

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        aiDailyUsage: shouldResetDaily ? 1 : user.aiDailyUsage + 1,
        aiMonthlyUsage: shouldResetMonthly ? 1 : user.aiMonthlyUsage + 1,
        aiLifetimeUsage: user.aiLifetimeUsage + 1,
        aiLastResetDate: now
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update AI credits' }, { status: 500 });
  }
}
