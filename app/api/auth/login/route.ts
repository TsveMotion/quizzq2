import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { createTokenEdge } from '@/lib/auth';

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

    if (!prisma?.user) {
      console.error('Prisma client not initialized properly');
      return NextResponse.json(
        { error: 'Database connection error' },
        { status: 500 }
      );
    }

    // Find user
    console.log('Finding user...');
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        school: true,
      },
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

    // Generate token using the Edge-compatible auth library
    console.log('Generating token...');
    console.log('User data for token:', {
      id: user.id,
      email: user.email,
      role: user.role,
      powerLevel: user.powerLevel,
      schoolId: user.schoolId,
    });

    const token = await createTokenEdge({
      userId: user.id,
      email: user.email,
      role: user.role,
      powerLevel: user.powerLevel,
      schoolId: user.schoolId,
    });

    // Create the response with the token
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        powerLevel: user.powerLevel,
        schoolId: user.schoolId,
        school: user.school,
      },
    });

    // Set the token as an HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    console.log('Login successful for:', email);
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
