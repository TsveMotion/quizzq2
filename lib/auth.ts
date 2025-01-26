import { getServerSession, type NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { Role } from "@prisma/client";
import { randomBytes } from "crypto";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            image: true,
            email_verified: true,
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
            updatedAt: true,
            password: true
          }
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        const { password, ...userWithoutPassword } = user;
        return {
          ...userWithoutPassword,
          emailVerified: userWithoutPassword.email_verified
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile, email }) {
      try {
        if (account?.provider === "google") {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              image: true,
              email_verified: true,
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

          if (!existingUser) {
            const randomPassword = randomBytes(32).toString('hex');
            const newUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || "",
                image: user.image,
                password: randomPassword,
                role: Role.USER,
                status: "ACTIVE",
                email_verified: new Date(),
                powerLevel: 1,
                isPro: false,
                proPlanIsActive: false,
                proPlanIsTrial: false,
                aiDailyUsage: 0,
                aiMonthlyUsage: 0,
                aiLifetimeUsage: 0,
                aiLastResetDate: new Date(),
                subscriptionPlan: "FREE"
              },
              select: {
                id: true,
                email: true,
                name: true,
                role: true,
                image: true,
                email_verified: true,
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

            Object.assign(user, {
              ...newUser,
              emailVerified: newUser.email_verified
            });
          } else {
            Object.assign(user, {
              ...existingUser,
              emailVerified: existingUser.email_verified
            });
          }
        }
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        Object.assign(token, {
          ...user,
          emailVerified: user.email_verified
        });
      }
      return token;
    },
    async session({ session, token, user }) {
      if (session.user) {
        Object.assign(session.user, {
          ...token,
          emailVerified: token.email_verified
        });
      }
      return session;
    }
  },
  pages: {
    signIn: '/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

export const getAuthSession = () => getServerSession(authOptions);
