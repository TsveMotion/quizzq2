import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
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
      // Update superadmin password
      const hashedPassword = await hash('superadmin@quizzq.com', 10);
      await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          status: 'ACTIVE'
        },
      });
      console.log('Superadmin password updated successfully');
      return;
    }

    // Create superadmin
    const hashedPassword = await hash('superadmin@quizzq.com', 10);
    
    const superadmin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: 'Super Admin',
        role: ROLES.SUPERADMIN,
        powerLevel: 5,
        status: 'ACTIVE'
      },
    });

    console.log('Superadmin created successfully:', superadmin.email);
  } catch (error) {
    console.error('Error managing superadmin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSuperAdmin();
