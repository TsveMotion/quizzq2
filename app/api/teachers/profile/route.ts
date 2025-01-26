import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getAuthSession();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        email_verified: true,
        image: true,
        role: true,
        status: true,
        schoolId: true,
        teacherId: true,
        powerLevel: true,
        isPro: true,
        proSubscriptionId: true,
        proExpiresAt: true,
        proType: true,
        proStatus: true,
        proPlan: true,
        proPlanId: true,
        proPlanName: true,
        proPlanPrice: true,
        proPlanCurrency: true,
        proPlanInterval: true,
        proPlanTrialPeriodDays: true,
        proPlanIsActive: true,
        proPlanIsTrial: true,
        proPlanStartedAt: true,
        proPlanEndedAt: true,
        subscriptionPlan: true,
        aiDailyUsage: true,
        aiMonthlyUsage: true,
        aiLifetimeUsage: true,
        aiLastResetDate: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    if (user.role !== Role.TEACHER) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("[TEACHER_PROFILE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name } = body;

    const user = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name,
      },
      select: {
        id: true,
        name: true,
        email: true,
        email_verified: true,
        image: true,
        role: true,
        status: true,
        schoolId: true,
        teacherId: true,
        powerLevel: true,
        isPro: true,
        proSubscriptionId: true,
        proExpiresAt: true,
        proType: true,
        proStatus: true,
        proPlan: true,
        proPlanId: true,
        proPlanName: true,
        proPlanPrice: true,
        proPlanCurrency: true,
        proPlanInterval: true,
        proPlanTrialPeriodDays: true,
        proPlanIsActive: true,
        proPlanIsTrial: true,
        proPlanStartedAt: true,
        proPlanEndedAt: true,
        subscriptionPlan: true,
        aiDailyUsage: true,
        aiMonthlyUsage: true,
        aiLifetimeUsage: true,
        aiLastResetDate: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[TEACHER_PROFILE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
