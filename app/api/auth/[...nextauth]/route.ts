import NextAuth from "next-auth";
import { compare } from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { options } from "./options";

const handler = NextAuth(options);

options.providers = [
  CredentialsProvider({
    name: 'credentials',
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        throw new Error('Please enter your email and password');
      }

      const user = await db.user.findUnique({
        where: {
          email: credentials.email
        },
        include: {
          school: true
        }
      });

      if (!user) {
        throw new Error('No user found with this email');
      }

      const isPasswordValid = await compare(credentials.password, user.password);

      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        powerLevel: user.powerLevel,
        schoolId: user.schoolId,
        school: user.school
      };
    }
  })
];

options.callbacks = {
  async jwt({ token, user }) {
    if (user) {
      return {
        ...token,
        id: user.id,
        role: user.role,
        powerLevel: user.powerLevel,
        schoolId: user.schoolId,
        school: user.school
      };
    }
    return token;
  },
  async session({ session, token }) {
    return {
      ...session,
      user: {
        ...session.user,
        id: token.id,
        role: token.role,
        powerLevel: token.powerLevel,
        schoolId: token.schoolId,
        school: token.school
      }
    };
  }
};

export { handler as GET, handler as POST };
