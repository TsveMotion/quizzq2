import { PrismaClient } from '@prisma/client';
import { quizzes } from '../prisma/quizSeed';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database setup...');

  // Read and execute the SQL migration
  console.log('📦 Running SQL migration...');
  const migrationPath = path.join(__dirname, '..', 'prisma', 'migrations', '20240109_add_quiz_tables.sql');
  const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
  
  // Split SQL commands and execute them one by one
  const commands = migrationSQL
    .split(';')
    .map(cmd => cmd.trim())
    .filter(cmd => cmd.length > 0);

  for (const command of commands) {
    try {
      await prisma.$executeRawUnsafe(command + ';');
    } catch (error: any) {
      if (error.meta?.message?.includes('already exists')) {
        console.log('⚠️ Table already exists, continuing...');
      } else {
        throw error;
      }
    }
  }

  // Seed quizzes
  console.log('📚 Seeding quizzes...');
  for (const quiz of quizzes) {
    const { questions, ...quizData } = quiz;
    
    try {
      // Create quiz with questions
      const createdQuiz = await prisma.quiz.create({
        data: {
          ...quizData,
          questions: {
            create: questions.map(({ options, ...questionData }) => ({
              ...questionData,
              options: options as any,
            })),
          },
        },
      });

      console.log(`✅ Created quiz: ${createdQuiz.title}`);
    } catch (error: any) {
      if (error.code === 'P2002') {
        console.log(`⚠️ Quiz "${quiz.title}" already exists, skipping...`);
      } else {
        console.error(`❌ Error creating quiz "${quiz.title}":`, error);
      }
    }
  }

  console.log('✅ Database setup complete!');
}

main()
  .catch((e) => {
    console.error('Error during database setup:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
