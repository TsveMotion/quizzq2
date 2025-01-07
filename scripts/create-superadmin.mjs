import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function main() {
  try {
    console.log('Starting superadmin creation...');
    const email = process.env.SUPERADMIN_EMAIL;
    const password = process.env.SUPERADMIN_PASSWORD;

    console.log('Using email:', email);
    const hashedPassword = await hash(password, 10);
    
    // Delete existing user first to ensure clean state
    try {
      await prisma.user.delete({
        where: { email }
      });
      console.log('Deleted existing user');
    } catch (e) {
      console.log('No existing user to delete');
    }
    
    const user = await prisma.user.create({
      data: {
        email,
        name: 'Super Admin',
        password: hashedPassword,
        role: 'SUPERADMIN',
        status: 'ACTIVE',
        powerLevel: 100,
        emailVerified: new Date(),
      },
    });

    console.log('Created superadmin user:', {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      powerLevel: user.powerLevel,
      emailVerified: user.emailVerified
    });
  } catch (error) {
    console.error('Error creating superadmin user:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
