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

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      schoolId: string | null;
      isPro: boolean;
      proSubscriptionId: string | null;
      proExpiresAt: Date | null;
      proType: string | null;
      powerLevel: number;
      proStatus: string;
      proPlan: string | null;
      emailVerified: Date | null;
      image: string | null;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    role: string;
    schoolId: string | null;
    isPro: boolean;
    proSubscriptionId: string | null;
    proExpiresAt: Date | null;
    proType: string | null;
    powerLevel: number;
    proStatus: string;
    proPlan: string | null;
    emailVerified: Date | null;
    image: string | null;
  }
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
            }
          });

          if (!user || !user.password) {
            return null;
          }

          const isValidPassword = await compare(credentials.password, user.password);

          if (!isValidPassword) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            schoolId: user.schoolId,
            emailVerified: user.emailVerified,
            image: user.image,
            isPro: user.isPro,
            proSubscriptionId: user.proSubscriptionId,
            proExpiresAt: user.proExpiresAt,
            proType: user.proType,
            powerLevel: user.powerLevel,
            proStatus: user.proStatus,
            proPlan: user.proPlan,
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
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.role = token.role;
        session.user.schoolId = token.schoolId;
        session.user.isPro = token.isPro;
        session.user.proSubscriptionId = token.proSubscriptionId;
        session.user.proExpiresAt = token.proExpiresAt;
        session.user.proType = token.proType;
        session.user.powerLevel = token.powerLevel;
        session.user.proStatus = token.proStatus;
        session.user.proPlan = token.proPlan;
        session.user.emailVerified = token.emailVerified;
        session.user.image = token.image;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/signin"
  }
};
