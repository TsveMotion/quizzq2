import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database setup...');

  // First get or create admin user
  let adminUser = await prisma.user.findFirst({ 
    where: { email: 'admin@example.com' } 
  });

  if (!adminUser) {
    console.log('Creating admin user...');
    adminUser = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        name: 'Admin',
        password: 'admin123', // Remember to hash in production
        role: 'ADMIN'
      }
    });
  }

  // Load quiz data
  const quizData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/quizzes.json'), 'utf-8'));

  for (const quiz of quizData) {
    try {
      const createdQuiz = await prisma.quiz.create({
        data: {
          title: quiz.title,
          description: quiz.description,
          topic: quiz.topic,
          difficulty: quiz.difficulty,
          isPremium: quiz.isPremium,
          published: quiz.published,
          totalQuestions: quiz.totalQuestions,
          timeLimit: quiz.timeLimit,
          user: {
            connect: {
              id: adminUser.id
            }
          },
          questions: {
            create: quiz.questions.map((q: any) => ({
              question: q.question,
              options: Array.isArray(q.options) ? q.options : [q.options],
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
              order: q.order
            }))
          }
        }
      });

      console.log(`✅ Created quiz: ${createdQuiz.title}`);
    } catch (error) {
      console.error(`❌ Error creating quiz: ${quiz.title}`, error);
    }
  }

  console.log('🌱 Database setup complete!');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
