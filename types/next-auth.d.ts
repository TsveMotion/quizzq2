import { Role } from "@prisma/client";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name: string | null;
    email: string;
    email_verified: Date | null;
    image: string | null;
    role: Role;
    status: string;
    schoolId: string | null;
    teacherId: string | null;
    powerLevel: number;
    isPro: boolean;
    proSubscriptionId: string | null;
    proExpiresAt: Date | null;
    proType: string | null;
    proStatus: string | null;
    proPlan: string | null;
    proPlanId: string | null;
    proPlanName: string | null;
    proPlanPrice: number | null;
    proPlanCurrency: string | null;
    proPlanInterval: string | null;
    proPlanTrialPeriodDays: number | null;
    proPlanIsActive: boolean;
    proPlanIsTrial: boolean;
    proPlanStartedAt: Date | null;
    proPlanEndedAt: Date | null;
    subscriptionPlan: string;
    aiDailyUsage: number;
    aiMonthlyUsage: number;
    aiLifetimeUsage: number;
    aiLastResetDate: Date;
    createdAt: Date;
    updatedAt: Date;
  }

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string | null;
    email: string;
    email_verified: Date | null;
    image: string | null;
    role: Role;
    status: string;
    schoolId: string | null;
    teacherId: string | null;
    powerLevel: number;
    isPro: boolean;
    proSubscriptionId: string | null;
    proExpiresAt: Date | null;
    proType: string | null;
    proStatus: string | null;
    proPlan: string | null;
    proPlanId: string | null;
    proPlanName: string | null;
    proPlanPrice: number | null;
    proPlanCurrency: string | null;
    proPlanInterval: string | null;
    proPlanTrialPeriodDays: number | null;
    proPlanIsActive: boolean;
    proPlanIsTrial: boolean;
    proPlanStartedAt: Date | null;
    proPlanEndedAt: Date | null;
    subscriptionPlan: string;
    aiDailyUsage: number;
    aiMonthlyUsage: number;
    aiLifetimeUsage: number;
    aiLastResetDate: Date;
    createdAt: Date;
    updatedAt: Date;
  }
}
