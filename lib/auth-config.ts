import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            school: {
              include: {
                classes: true,
                users: {
                  where: {
                    OR: [
                      { role: "TEACHER" },
                      { role: "STUDENT" }
                    ]
                  }
                }
              }
            },
            enrolledClasses: {
              include: {
                teacher: true,
                classTeachers: {
                  include: {
                    teacher: true
                  }
                }
              }
            },
            teachingClasses: true,
          }
        });

        if (!user) {
          throw new Error('Invalid email or password');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error('Invalid email or password');
        }

        if (user.status !== 'ACTIVE') {
          throw new Error('Your account is not active. Please contact support.');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          powerLevel: user.powerLevel,
          schoolId: user.schoolId,
          school: user.school,
          status: user.status,
          enrolledClasses: user.enrolledClasses,
          teachingClasses: user.teachingClasses,
        };
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          powerLevel: user.powerLevel,
          schoolId: user.schoolId,
          school: user.school,
          status: user.status,
          enrolledClasses: user.enrolledClasses,
          teachingClasses: user.teachingClasses,
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
          school: token.school,
          status: token.status,
          enrolledClasses: token.enrolledClasses,
          teachingClasses: token.teachingClasses,
        }
      };
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NEXTAUTH_DEBUG === 'true',
};
