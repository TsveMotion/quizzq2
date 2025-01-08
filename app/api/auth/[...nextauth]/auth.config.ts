import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/lib/supabase";

export const authOptions: NextAuthOptions = {
  providers: [
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

        try {
          const { data: { user }, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });

          if (error || !user) {
            return null;
          }

          return {
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.full_name || user.email || '',
            role: user.user_metadata?.role || 'student',
            schoolId: user.user_metadata?.schoolId || null,
            emailVerified: null,
            image: null,
            isPro: false,
            proSubscriptionId: null,
            proExpiresAt: null,
            proType: null,
            powerLevel: 0,
            proStatus: 'INACTIVE',
            proPlan: null,
            proPlanId: null,
            proPlanName: null,
            proPlanPrice: null,
            proPlanCurrency: null,
            proPlanInterval: null,
            proPlanTrialPeriodDays: null,
            proPlanIsActive: false,
            proPlanIsTrial: false,
            proPlanStartedAt: null,
            proPlanEndedAt: null
          };
        } catch (error) {
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.schoolId = user.schoolId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.schoolId = token.schoolId;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
} as const;
