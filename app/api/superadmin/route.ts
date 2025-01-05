import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// POST /api/superadmin - Create a superadmin user
export async function POST(req: Request) {
  try {
    const existingSuperadmin = await prisma.user.findFirst({
      where: {
        role: 'superadmin',
      },
    });

    if (existingSuperadmin) {
      return NextResponse.json(
        { error: 'Superadmin already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash('superadmin', 10);

    const superadmin = await prisma.user.create({
      data: {
        email: 'superadmin@quizzq.com',
        name: 'Super Admin',
        password: hashedPassword,
        role: 'superadmin',
        powerLevel: 10,
      },
    });

    return NextResponse.json(
      { message: 'Superadmin created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating superadmin:', error);
    return NextResponse.json(
      { error: 'Failed to create superadmin' },
      { status: 500 }
    );
  }
}
