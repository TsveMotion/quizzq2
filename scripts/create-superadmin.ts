const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  try {
    // Hash the password
    const hashedPassword = await hash('superadmin@quizzq.com', 10);

    // Create superadmin user
    const superadmin = await prisma.user.create({
      data: {
        email: 'superadmin@quizzq.com',
        password: hashedPassword,
        name: 'Super Admin',
        role: 'superadmin',
        powerLevel: 5, // Highest power level
      },
    });

    console.log('Superadmin created successfully:', superadmin);
  } catch (error) {
    console.error('Error creating superadmin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
