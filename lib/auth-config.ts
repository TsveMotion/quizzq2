import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import { AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import prisma from "@/lib/prisma";
import { User, Role } from "@prisma/client";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    role: Role;
    schoolId: string | null;
    powerLevel: number;
    emailVerified: Date | null;
    image: string | null;
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
  }

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    role: Role;
    schoolId: string | null;
    powerLevel: number;
    emailVerified: Date | null;
    image: string | null;
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
  }
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as any, // Type assertion needed due to version mismatch
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          return null;
        }

        const isValid = await compare(credentials.password, user.password);

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          schoolId: user.schoolId,
          powerLevel: user.powerLevel,
          emailVerified: user.emailVerified,
          image: user.image,
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
          proPlanIsActive: user.proPlanIsActive ?? false,
          proPlanIsTrial: user.proPlanIsTrial ?? false,
          proPlanStartedAt: user.proPlanStartedAt ?? null,
          proPlanEndedAt: user.proPlanEndedAt ?? null
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.schoolId = user.schoolId;
        token.powerLevel = user.powerLevel;
        token.emailVerified = user.emailVerified;
        token.image = user.image;
        token.isPro = user.isPro;
        token.proSubscriptionId = user.proSubscriptionId;
        token.proExpiresAt = user.proExpiresAt;
        token.proType = user.proType;
        token.proStatus = user.proStatus;
        token.proPlan = user.proPlan;
        token.proPlanId = user.proPlanId;
        token.proPlanName = user.proPlanName;
        token.proPlanPrice = user.proPlanPrice;
        token.proPlanCurrency = user.proPlanCurrency;
        token.proPlanInterval = user.proPlanInterval;
        token.proPlanTrialPeriodDays = user.proPlanTrialPeriodDays;
        token.proPlanIsActive = user.proPlanIsActive;
        token.proPlanIsTrial = user.proPlanIsTrial;
        token.proPlanStartedAt = user.proPlanStartedAt;
        token.proPlanEndedAt = user.proPlanEndedAt;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.role = token.role;
        session.user.schoolId = token.schoolId;
        session.user.powerLevel = token.powerLevel;
        session.user.emailVerified = token.emailVerified;
        session.user.image = token.image;
        session.user.isPro = token.isPro;
        session.user.proSubscriptionId = token.proSubscriptionId;
        session.user.proExpiresAt = token.proExpiresAt;
        session.user.proType = token.proType;
        session.user.proStatus = token.proStatus;
        session.user.proPlan = token.proPlan;
        session.user.proPlanId = token.proPlanId;
        session.user.proPlanName = token.proPlanName;
        session.user.proPlanPrice = token.proPlanPrice;
        session.user.proPlanCurrency = token.proPlanCurrency;
        session.user.proPlanInterval = token.proPlanInterval;
        session.user.proPlanTrialPeriodDays = token.proPlanTrialPeriodDays;
        session.user.proPlanIsActive = token.proPlanIsActive;
        session.user.proPlanIsTrial = token.proPlanIsTrial;
        session.user.proPlanStartedAt = token.proPlanStartedAt;
        session.user.proPlanEndedAt = token.proPlanEndedAt;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/signin',
  },
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export default handler;
export type { AuthOptions };
