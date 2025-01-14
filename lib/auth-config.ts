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
      emailVerified: Date | null;
      image: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    role: string;
    schoolId: string | null;
    proStatus: string;
    proPlanIsActive: boolean;
    proPlanIsTrial: boolean;
    proExpiresAt: Date | null;
    proPlanStartedAt: Date | null;
    proPlanEndedAt: Date | null;
    powerLevel: number;
    emailVerified: Date | null;
    image: string | null;
    isPro: boolean;
    proSubscriptionId: string | null;
    proType: string | null;
    proPlan: string | null;
    proPlanId: string | null;
    proPlanName: string | null;
    proPlanPrice: number | null;
    proPlanCurrency: string | null;
    proPlanInterval: string | null;
    proPlanTrialPeriodDays: number | null;
  }
}

import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import { AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import prisma from "@/lib/prisma";
import { User } from "@prisma/client";

interface ExtendedUser extends User {
  isPro: boolean;
  proSubscriptionId: string | null;
  proExpiresAt: Date | null;
  proType: string | null;
  proStatus: string;
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

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            select: {
              id: true,
              name: true,
              email: true,
              password: true,
              role: true,
              powerLevel: true,
              status: true,
              emailVerified: true,
              image: true,
              schoolId: true,
              proStatus: true,
              proPlanIsActive: true,
              proPlanIsTrial: true,
              proExpiresAt: true,
              proPlanStartedAt: true,
              proPlanEndedAt: true,
            }
          });

          if (!user) {
            return null;
          }

          const isValidPassword = await compare(credentials.password, user.password);

          if (!isValidPassword) {
            return null;
          }

          const proStatus = user.proStatus || 'INACTIVE';
          const proPlanIsActive = !!user.proPlanIsActive;
          const proPlanIsTrial = !!user.proPlanIsTrial;

          const userWithDefaults = {
            ...user,
            proStatus: proStatus,
            proPlanIsActive: proPlanIsActive,
            proPlanIsTrial: proPlanIsTrial,
            proExpiresAt: user.proExpiresAt || null,
            proPlanStartedAt: user.proPlanStartedAt || null,
            proPlanEndedAt: user.proPlanEndedAt || null,
            emailVerified: user.emailVerified || null,
            image: user.image || null,
            schoolId: user.schoolId || null,
            subjects: [],
            education: '',
            experience: '',
            phoneNumber: '',
            officeHours: '',
            isPro: false,
            proSubscriptionId: null,
            proType: null,
            proPlan: null,
            proPlanId: null,
            proPlanName: null,
            proPlanPrice: null,
            proPlanCurrency: null,
            proPlanInterval: null,
            proPlanTrialPeriodDays: null,
          } as const;

          return {
            id: userWithDefaults.id,
            name: userWithDefaults.name,
            email: userWithDefaults.email,
            password: userWithDefaults.password,
            role: userWithDefaults.role,
            powerLevel: userWithDefaults.powerLevel || 0,
            status: userWithDefaults.status || 'INACTIVE',
            emailVerified: userWithDefaults.emailVerified,
            image: userWithDefaults.image,
            schoolId: userWithDefaults.schoolId,
            teacherId: null,
            avatar: null,
            bio: null,
            subjects: userWithDefaults.subjects,
            education: userWithDefaults.education,
            experience: userWithDefaults.experience,
            phoneNumber: userWithDefaults.phoneNumber,
            officeHours: userWithDefaults.officeHours,
            isPro: false,
            proSubscriptionId: null,
            proExpiresAt: userWithDefaults.proExpiresAt,
            proType: null,
            proStatus: userWithDefaults.proStatus,
            proPlan: null,
            proPlanId: null,
            proPlanName: null,
            proPlanPrice: null,
            proPlanCurrency: null,
            proPlanInterval: null,
            proPlanTrialPeriodDays: null,
            proPlanIsActive: userWithDefaults.proPlanIsActive,
            proPlanIsTrial: userWithDefaults.proPlanIsTrial,
            proPlanStartedAt: userWithDefaults.proPlanStartedAt,
            proPlanEndedAt: userWithDefaults.proPlanEndedAt,
            createdAt: new Date(),
            updatedAt: new Date()
          } as unknown as ExtendedUser;
        } catch (error) {
          console.error('Error in authorize:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Cast the user object to include all required fields with proper types
        const typedUser = {
          id: user.id!,
          email: user.email!,
          name: user.name!,
          role: user.role!,
          schoolId: user.schoolId || null,
          proStatus: user.proStatus || 'INACTIVE',
          proPlanIsActive: Boolean(user.proPlanIsActive),
          proPlanIsTrial: Boolean(user.proPlanIsTrial),
          proExpiresAt: user.proExpiresAt || null,
          proPlanStartedAt: user.proPlanStartedAt || null,
          proPlanEndedAt: user.proPlanEndedAt || null,
          powerLevel: user.powerLevel || 0,
          emailVerified: user.emailVerified || null,
          image: user.image || null,
          isPro: Boolean(user.isPro),
          proSubscriptionId: user.proSubscriptionId || null,
          proType: user.proType || null,
          proPlan: user.proPlan || null,
          proPlanId: user.proPlanId || null,
          proPlanName: user.proPlanName || null,
          proPlanPrice: user.proPlanPrice || null,
          proPlanCurrency: user.proPlanCurrency || null,
          proPlanInterval: user.proPlanInterval || null,
          proPlanTrialPeriodDays: user.proPlanTrialPeriodDays || null,
        };

        token = {
          ...token,
          ...typedUser
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
          role: token.role as string,
          schoolId: token.schoolId as string | null,
          proStatus: (token.proStatus as string) || 'INACTIVE',
          proPlanIsActive: !!token.proPlanIsActive,
          proPlanIsTrial: !!token.proPlanIsTrial,
          proExpiresAt: token.proExpiresAt as Date | null,
          proPlanStartedAt: token.proPlanStartedAt as Date | null,
          proPlanEndedAt: token.proPlanEndedAt as Date | null,
          powerLevel: (token.powerLevel as number) || 0,
          emailVerified: token.emailVerified as Date | null,
          image: token.image as string | null,
          isPro: token.isPro,
          proSubscriptionId: token.proSubscriptionId,
          proType: token.proType,
          proPlan: token.proPlan,
          proPlanId: token.proPlanId,
          proPlanName: token.proPlanName,
          proPlanPrice: token.proPlanPrice,
          proPlanCurrency: token.proPlanCurrency,
          proPlanInterval: token.proPlanInterval,
          proPlanTrialPeriodDays: token.proPlanTrialPeriodDays,
        };
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
