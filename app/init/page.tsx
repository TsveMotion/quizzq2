import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { ROLES } from '@/lib/roles';

export default async function InitPage() {
  const email = process.env.SUPERADMIN_EMAIL;
  const password = process.env.SUPERADMIN_PASSWORD;

  if (!email || !password) {
    console.error('Missing SUPERADMIN_EMAIL or SUPERADMIN_PASSWORD environment variables');
    redirect('/login');
    return;
  }

  try {
    // Check if superadmin exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingAdmin) {
      // Create superadmin
      const hashedPassword = await bcrypt.hash(password, 10);
      
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: 'Super Admin',
          role: ROLES.SUPERADMIN,
          powerLevel: 5,
        },
      });

      console.log('Superadmin created successfully');
    }
  } catch (error) {
    console.error('Error:', error);
  }

  redirect('/login');
}
