import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { validateRole, getRolePowerLevel, ROLES } from '@/lib/roles';

export async function POST(req: Request) {
  try {
    const { email, password, name, role = ROLES.MEMBER } = await req.json();
    console.log('Signup attempt for:', email);

    if (!email || !password) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate role
    if (!validateRole(role)) {
      console.log('Invalid role:', role);
      return NextResponse.json(
        { error: 'Invalid role specified' },
        { status: 400 }
      );
    }

    // Check if user already exists
    console.log('Checking for existing user...');
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('User already exists:', email);
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with role and power level
    console.log('Creating new user with role:', role);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        role,
        powerLevel: getRolePowerLevel(role),
      },
    }).catch((error) => {
      console.error('Database error:', error);
      throw error;
    });

    console.log('User created successfully:', user.id);
    return NextResponse.json(
      { 
        success: true,
        message: 'User created successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          powerLevel: user.powerLevel,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    // Check for specific Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'This email is already registered' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Something went wrong during signup' },
      { status: 500 }
    );
  }
}
