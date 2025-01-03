import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { ROLES } from '../lib/roles';

const prisma = new PrismaClient();

async function createSuperAdmin() {
  try {
    const email = 'superadmin@quizzq.com';
    
    // Check if superadmin exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.log('Superadmin already exists');
      return;
    }

    // Create superadmin
    const hashedPassword = await bcrypt.hash('Tsvetozar_TsveK22', 10);
    
    const superadmin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: 'Super Admin',
        role: ROLES.SUPERADMIN,
        powerLevel: 5,
      },
    });

    console.log('Superadmin created successfully:', superadmin.email);
  } catch (error) {
    console.error('Error creating superadmin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSuperAdmin();
