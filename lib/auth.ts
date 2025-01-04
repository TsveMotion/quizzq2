import jwt from 'jsonwebtoken';
import * as jose from 'jose';
import { cookies } from 'next/headers';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';
import { compare } from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-123';
const EDGE_JWT_SECRET = new TextEncoder().encode(JWT_SECRET);

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  powerLevel: number;
  schoolId?: string;
  iat?: number;
  exp?: number;
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });

        if (!user) {
          throw new Error('No user found');
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
          schoolId: user.schoolId,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
          schoolId: user.schoolId,
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
          schoolId: token.schoolId,
        }
      };
    }
  }
};

export async function verifyAuth(token: string): Promise<JWTPayload> {
  try {
    console.log('Verifying token...');
    const verified = jwt.verify(token, JWT_SECRET) as JWTPayload;
    console.log('Token verified successfully:', verified);
    return verified;
  } catch (error) {
    console.error('Token verification failed:', error);
    throw new Error('Invalid token');
  }
}

export async function verifyAuthEdge(token: string): Promise<JWTPayload> {
  try {
    console.log('Verifying token in Edge runtime...');
    const { payload } = await jose.jwtVerify(token, EDGE_JWT_SECRET);
    console.log('Token verified successfully in Edge:', payload);
    return payload as JWTPayload;
  } catch (error) {
    console.error('Token verification failed in Edge:', error);
    throw new Error('Invalid token');
  }
}

export function createToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export async function createTokenEdge(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(EDGE_JWT_SECRET);
}

export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch {
    return null;
  }
}

export async function verifyToken(): Promise<JWTPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return null;
    }

    return await verifyAuth(token);
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}
