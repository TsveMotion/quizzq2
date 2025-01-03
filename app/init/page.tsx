import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { ROLES } from '@/lib/roles';

export default async function InitPage() {
  const email = 'superadmin@quizzq.com';

  try {
    // Check if superadmin exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingAdmin) {
      // Create superadmin
      const hashedPassword = await bcrypt.hash('Tsvetozar_TsveK22', 10);
      
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: 'Super Admin',
          role: ROLES.SUPERADMIN,
          powerLevel: 5,
        },
      });
    }
  } catch (error) {
    console.error('Error:', error);
  }

  redirect('/login');
}
