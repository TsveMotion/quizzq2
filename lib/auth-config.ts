import NextAuth, { NextAuthOptions } from "next-auth";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { Role } from "@prisma/client";
import { CustomPrismaAdapter } from "@/lib/custom-prisma-adapter";

export interface UserType {
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

export const authOptions: NextAuthOptions = {
  adapter: CustomPrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
          select: {
            id: true,
            name: true,
            email: true,
            email_verified: true,
            password: true,
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
          },
        });

        if (!user) {
          throw new Error("No user found");
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          email_verified: user.email_verified,
          status: user.status,
          schoolId: user.schoolId,
          teacherId: user.teacherId,
          powerLevel: user.powerLevel,
          isPro: user.isPro,
          proSubscriptionId: user.proSubscriptionId,
          proExpiresAt: user.proExpiresAt,
          proType: user.proType,
          proStatus: user.proStatus,
          proPlan: user.proPlan,
          proPlanId: user.proPlanId,
          proPlanName: user.proPlanName,
          proPlanPrice: user.proPlanPrice,
          proPlanCurrency: user.proPlanCurrency,
          proPlanInterval: user.proPlanInterval,
          proPlanTrialPeriodDays: user.proPlanTrialPeriodDays,
          proPlanIsActive: user.proPlanIsActive,
          proPlanIsTrial: user.proPlanIsTrial,
          proPlanStartedAt: user.proPlanStartedAt,
          proPlanEndedAt: user.proPlanEndedAt,
          subscriptionPlan: user.subscriptionPlan,
          aiDailyUsage: user.aiDailyUsage,
          aiMonthlyUsage: user.aiMonthlyUsage,
          aiLifetimeUsage: user.aiLifetimeUsage,
          aiLastResetDate: user.aiLastResetDate,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          role: user.role,
          status: user.status,
          schoolId: user.schoolId,
          teacherId: user.teacherId,
          powerLevel: user.powerLevel,
          isPro: user.isPro,
          proSubscriptionId: user.proSubscriptionId,
          proExpiresAt: user.proExpiresAt,
          proType: user.proType,
          proStatus: user.proStatus,
          proPlan: user.proPlan,
          proPlanId: user.proPlanId,
          proPlanName: user.proPlanName,
          proPlanPrice: user.proPlanPrice,
          proPlanCurrency: user.proPlanCurrency,
          proPlanInterval: user.proPlanInterval,
          proPlanTrialPeriodDays: user.proPlanTrialPeriodDays,
          proPlanIsActive: user.proPlanIsActive,
          proPlanIsTrial: user.proPlanIsTrial,
          proPlanStartedAt: user.proPlanStartedAt,
          proPlanEndedAt: user.proPlanEndedAt,
          subscriptionPlan: user.subscriptionPlan,
          aiDailyUsage: user.aiDailyUsage,
          aiMonthlyUsage: user.aiMonthlyUsage,
          aiLifetimeUsage: user.aiLifetimeUsage,
          aiLastResetDate: user.aiLastResetDate
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          role: token.role,
          status: token.status,
          schoolId: token.schoolId,
          teacherId: token.teacherId,
          powerLevel: token.powerLevel,
          isPro: token.isPro,
          proSubscriptionId: token.proSubscriptionId,
          proExpiresAt: token.proExpiresAt,
          proType: token.proType,
          proStatus: token.proStatus,
          proPlan: token.proPlan,
          proPlanId: token.proPlanId,
          proPlanName: token.proPlanName,
          proPlanPrice: token.proPlanPrice,
          proPlanCurrency: token.proPlanCurrency,
          proPlanInterval: token.proPlanInterval,
          proPlanTrialPeriodDays: token.proPlanTrialPeriodDays,
          proPlanIsActive: token.proPlanIsActive,
          proPlanIsTrial: token.proPlanIsTrial,
          proPlanStartedAt: token.proPlanStartedAt,
          proPlanEndedAt: token.proPlanEndedAt,
          subscriptionPlan: token.subscriptionPlan,
          aiDailyUsage: token.aiDailyUsage,
          aiMonthlyUsage: token.aiMonthlyUsage,
          aiLifetimeUsage: token.aiLifetimeUsage,
          aiLastResetDate: token.aiLastResetDate
        },
      };
    },
  },
};

const handler = NextAuth(authOptions);
export default handler;
export type { NextAuthOptions };
