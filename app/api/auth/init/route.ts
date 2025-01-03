import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { ROLES } from '@/lib/roles';

const SUPERADMIN_EMAIL = 'superadmin@quizzq.com';

export async function POST(req: Request) {
  try {
    // Check if superadmin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: SUPERADMIN_EMAIL },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Superadmin already exists' },
        { status: 400 }
      );
    }

    // Create superadmin
    const hashedPassword = await bcrypt.hash('Tsvetozar_TsveK22', 10);
    
    const superadmin = await prisma.user.create({
      data: {
        email: SUPERADMIN_EMAIL,
        password: hashedPassword,
        name: 'Super Admin',
        role: ROLES.SUPERADMIN,
        powerLevel: 5,
      },
    });

    return NextResponse.json(
      { 
        success: true,
        message: 'Superadmin created successfully',
        user: {
          id: superadmin.id,
          email: superadmin.email,
          name: superadmin.name,
          role: superadmin.role,
        }
      },
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
