import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
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
          role: user.role,
          schoolId: user.schoolId,
          emailVerified: user.emailVerified,
          image: user.image,
          isPro: user.isPro ?? false,
          proSubscriptionId: user.proSubscriptionId,
          proExpiresAt: user.proExpiresAt,
          proType: user.proType,
          powerLevel: user.powerLevel ?? 0,
          proStatus: user.proStatus ?? 'INACTIVE',
          proPlan: user.proPlan,
          proPlanId: user.proPlanId,
          proPlanName: user.proPlanName,
          proPlanPrice: user.proPlanPrice ?? null,
          proPlanCurrency: user.proPlanCurrency,
          proPlanInterval: user.proPlanInterval,
          proPlanTrialPeriodDays: user.proPlanTrialPeriodDays ?? null,
          proPlanIsActive: user.proPlanIsActive ?? false,
          proPlanIsTrial: user.proPlanIsTrial ?? false,
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
        token.isPro = user.isPro;
        token.proSubscriptionId = user.proSubscriptionId;
        token.proExpiresAt = user.proExpiresAt;
        token.proType = user.proType;
        token.powerLevel = user.powerLevel;
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
        token.emailVerified = user.emailVerified;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string;
        session.user.schoolId = token.schoolId as string | null;
        session.user.isPro = token.isPro as boolean;
        session.user.proSubscriptionId = token.proSubscriptionId as string | null;
        session.user.proExpiresAt = token.proExpiresAt as Date | null;
        session.user.proType = token.proType as string | null;
        session.user.powerLevel = token.powerLevel as number;
        session.user.proStatus = token.proStatus as string;
        session.user.proPlan = token.proPlan as string | null;
        session.user.emailVerified = token.emailVerified as Date | null;
        session.user.image = token.image as string | null;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
