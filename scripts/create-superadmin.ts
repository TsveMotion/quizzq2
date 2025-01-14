import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

async function updateSuperAdmin() {
  const client = new PrismaClient();
  try {
    const hashedPassword = await hash('superadmin', 10);
    await client.user.update({
      where: {
        email: 'admin@quizzq.com'
      },
      data: {
        name: 'Super Admin',
        password: hashedPassword,
        role: 'SUPERADMIN',
        powerLevel: 100,
        status: 'ACTIVE',
        subscriptionStatus: 'active',
        subscriptionPlan: 'forever'
      },
    });
    console.log('Super admin updated successfully');
  } catch (error) {
    console.error('Error updating super admin:', error);
  } finally {
    await client.$disconnect();
  }
}

updateSuperAdmin();
