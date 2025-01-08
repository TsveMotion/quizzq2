import { User } from "@prisma/client";
import { compare } from "bcryptjs";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";

interface ExtendedUser extends User {
  proExpiresAt: Date | null;
  proPlanStartedAt: Date | null;
  proPlanEndedAt: Date | null;
}

export const authOptions: AuthOptions = {
  providers: [
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

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            select: {
              id: true,
              email: true,
              name: true,
              password: true,
              role: true,
              schoolId: true,
              emailVerified: true,
              image: true,
              isPro: true,
              proSubscriptionId: true,
              proExpiresAt: true,
              proType: true,
              powerLevel: true,
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
            return null;
          }

          const isPasswordValid = await compare(credentials.password, user.password);

          if (!isPasswordValid) {
            return null;
          }

          return {
            ...user,
            role: user.role || 'USER',
            schoolId: user.schoolId || null,
            emailVerified: user.emailVerified || null,
            image: user.image || null,
            isPro: user.isPro || false,
            proSubscriptionId: user.proSubscriptionId || null,
            proExpiresAt: user.proExpiresAt || null,
            proType: user.proType || null,
            powerLevel: user.powerLevel || 0,
            proStatus: user.proStatus || 'INACTIVE',
            proPlan: user.proPlan || null,
            proPlanId: user.proPlanId || null,
            proPlanName: user.proPlanName || null,
            proPlanPrice: user.proPlanPrice || null,
            proPlanCurrency: user.proPlanCurrency || null,
            proPlanInterval: user.proPlanInterval || null,
            proPlanTrialPeriodDays: user.proPlanTrialPeriodDays || null,
            proPlanIsActive: user.proPlanIsActive || false,
            proPlanIsTrial: user.proPlanIsTrial || false,
            proPlanStartedAt: user.proPlanStartedAt || null,
            proPlanEndedAt: user.proPlanEndedAt || null
          };
        } catch (error) {
          return null;
        }
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
        token.isPro = user.isPro;
        token.proSubscriptionId = user.proSubscriptionId;
        token.proExpiresAt = user.proExpiresAt;
        token.proType = user.proType;
        token.powerLevel = user.powerLevel;
        token.proStatus = user.proStatus;
        token.proPlan = user.proPlan;
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
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/auth/signin"
  }
};
