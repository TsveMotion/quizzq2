import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { prisma } from "@/lib/prisma";
import { JWT } from "next-auth/jwt";
import { RequestInternal } from "next-auth";
import { Role } from '@prisma/client';

// Extend the built-in types
declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    schoolId: string | null;
    emailVerified: Date | null;
    image: string | null;
    isPro: boolean;
    proSubscriptionId: string | null;
    proExpiresAt: Date | null;
    proType: string | null;
    powerLevel: number;
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
  }
  
  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    schoolId: string | null;
    isPro: boolean;
    proSubscriptionId: string | null;
    proExpiresAt: Date | null;
    proType: string | null;
    powerLevel: number;
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
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: "jwt" as const
  },
  pages: {
    signIn: '/signin',
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" }
      },
      async authorize(
        credentials: Record<"email" | "password", string> | undefined,
        req: Pick<RequestInternal, "body" | "query" | "headers" | "method">
      ): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide both email and password");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          },
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
            role: true,
            schoolId: true,
            status: true,
            powerLevel: true,
            emailVerified: true,
            image: true,
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
            proPlanEndedAt: true
          }
        });

        if (!user) {
          throw new Error("No user found with this email");
        }

        if (!user?.password) {
          return null;
        }

        const isValid = await compare(credentials.password, user.password);

        if (!isValid) {
          return null;
        }

        if (user.status !== 'ACTIVE') {
          throw new Error("Your account is not active. Please contact support.");
        }

        // Return type matches the User interface
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          schoolId: user.schoolId,
          emailVerified: user.emailVerified,
          image: user.image,
          isPro: Boolean(user.isPro),
          proSubscriptionId: user.proSubscriptionId,
          proExpiresAt: user.proExpiresAt,
          proType: user.proType,
          powerLevel: user.powerLevel,
          proStatus: user.proStatus || null,
          proPlan: user.proPlan,
          proPlanId: user.proPlanId,
          proPlanName: user.proPlanName,
          proPlanPrice: user.proPlanPrice,
          proPlanCurrency: user.proPlanCurrency,
          proPlanInterval: user.proPlanInterval,
          proPlanTrialPeriodDays: user.proPlanTrialPeriodDays,
          proPlanIsActive: Boolean(user.proPlanIsActive),
          proPlanIsTrial: Boolean(user.proPlanIsTrial),
          proPlanStartedAt: user.proPlanStartedAt,
          proPlanEndedAt: user.proPlanEndedAt
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.schoolId = user.schoolId;
        token.isPro = Boolean(user.isPro);
        token.proSubscriptionId = user.proSubscriptionId;
        token.proExpiresAt = user.proExpiresAt;
        token.proType = user.proType;
        token.powerLevel = user.powerLevel;
        token.proStatus = user.proStatus || null;
        token.proPlan = user.proPlan;
        token.proPlanId = user.proPlanId;
        token.proPlanName = user.proPlanName;
        token.proPlanPrice = user.proPlanPrice;
        token.proPlanCurrency = user.proPlanCurrency;
        token.proPlanInterval = user.proPlanInterval;
        token.proPlanTrialPeriodDays = user.proPlanTrialPeriodDays;
        token.proPlanIsActive = Boolean(user.proPlanIsActive);
        token.proPlanIsTrial = Boolean(user.proPlanIsTrial);
        token.proPlanStartedAt = user.proPlanStartedAt;
        token.proPlanEndedAt = user.proPlanEndedAt;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.schoolId = token.schoolId;
        session.user.isPro = Boolean(token.isPro);
        session.user.proSubscriptionId = token.proSubscriptionId;
        session.user.proExpiresAt = token.proExpiresAt;
        session.user.proType = token.proType;
        session.user.powerLevel = token.powerLevel;
        session.user.proStatus = token.proStatus || null;
        session.user.proPlan = token.proPlan;
        session.user.proPlanId = token.proPlanId;
        session.user.proPlanName = token.proPlanName;
        session.user.proPlanPrice = token.proPlanPrice;
        session.user.proPlanCurrency = token.proPlanCurrency;
        session.user.proPlanInterval = token.proPlanInterval;
        session.user.proPlanTrialPeriodDays = token.proPlanTrialPeriodDays;
        session.user.proPlanIsActive = Boolean(token.proPlanIsActive);
        session.user.proPlanIsTrial = Boolean(token.proPlanIsTrial);
        session.user.proPlanStartedAt = token.proPlanStartedAt;
        session.user.proPlanEndedAt = token.proPlanEndedAt;
      }
      return session;
    }
  }
};
