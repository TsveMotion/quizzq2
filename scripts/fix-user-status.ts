import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Update superadmin status
  await prisma.user.upsert({
    where: {
      email: 'superadmin@quizzq.com',
    },
    update: {
      status: 'ACTIVE',
    },
    create: {
      email: 'superadmin@quizzq.com',
      name: 'Super Admin',
      password: '$2a$10$YK/GUvbPKEYGqDSHKQYOz.YHhAYVXZJHX7UPQ4E3yqXqQmD7Q4Yte', // superadmin@quizzq.com
      role: 'SUPERADMIN',
      status: 'ACTIVE',
      powerLevel: 100,
    },
  });

  console.log('User status updated successfully');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
