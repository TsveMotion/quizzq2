import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import { AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import prisma from "@/lib/prisma";
import { User } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      schoolId: string | null;
      powerLevel: number;
      emailVerified: Date | null;
      image: string | null;
      subscriptionStatus: string;
      subscriptionPlan: string;
      subscriptionId: string | null;
      subscriptionEndDate: Date | null;
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
    powerLevel: number;
    emailVerified: Date | null;
    image: string | null;
    subscriptionStatus: string;
    subscriptionPlan: string;
    subscriptionId: string | null;
    subscriptionEndDate: Date | null;
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
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          },
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
            subscriptionStatus: true,
            subscriptionPlan: true,
            subscriptionId: true,
            subscriptionEndDate: true
          }
        });

        if (!user || !user.password) {
          throw new Error('Invalid credentials');
        }

        const isValidPassword = await compare(
          credentials.password,
          user.password
        );

        if (!isValidPassword) {
          throw new Error('Invalid credentials');
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
          subscriptionStatus: user.subscriptionStatus,
          subscriptionPlan: user.subscriptionPlan,
          subscriptionId: user.subscriptionId,
          subscriptionEndDate: user.subscriptionEndDate
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
        token.subscriptionStatus = user.subscriptionStatus;
        token.subscriptionPlan = user.subscriptionPlan;
        token.subscriptionId = user.subscriptionId;
        token.subscriptionEndDate = user.subscriptionEndDate;
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
        session.user.subscriptionStatus = token.subscriptionStatus;
        session.user.subscriptionPlan = token.subscriptionPlan;
        session.user.subscriptionId = token.subscriptionId;
        session.user.subscriptionEndDate = token.subscriptionEndDate;
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
