import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import * as jose from 'jose';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = new TextEncoder().encode('your-super-secret-key-123');

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    console.log('Login attempt for:', email);

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    console.log('Finding user...');
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        role: true,
        powerLevel: true,
      },
    }).catch((error) => {
      console.error('Database error:', error);
      throw error;
    });

    if (!user) {
      console.log('User not found:', email);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    console.log('Verifying password...');
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      console.log('Invalid password for:', email);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate token
    console.log('Generating token...');
    const token = await new jose.SignJWT({ 
      userId: user.id, 
      email: user.email,
      role: user.role,
      powerLevel: user.powerLevel
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(JWT_SECRET);

    console.log('Generated token:', token.substring(0, 20) + '...');

    // Create the response
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        powerLevel: user.powerLevel
      }
    });

    // Set cookie
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    console.log('Login successful for:', email);
    console.log('Cookie set with token');
    
    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Something went wrong during login' },
      { status: 500 }
    );
  }
}
