import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

async function createSuperAdmin() {
  const client = new PrismaClient();
  try {
    const hashedPassword = await hash('superadmin', 10);
    await client.user.create({
      data: {
        email: 'superadmin@quizzq.com',
        name: 'Super Admin',
        password: hashedPassword,
        role: 'SUPERADMIN',
        status: 'ACTIVE',
        powerLevel: 100,
        isPro: true
      }
    });
    console.log('Super admin created successfully');
  } catch (error) {
    console.error('Error creating super admin:', error);
  } finally {
    await client.$disconnect();
  }
}

createSuperAdmin();
