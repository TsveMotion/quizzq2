import { PrismaClient } from '@prisma/client';
import { quizzes } from '../prisma/quizSeed';

const prisma = new PrismaClient();

async function main() {
  // First create or find a default user
  const defaultUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });

  if (!defaultUser) {
    throw new Error('No admin user found. Please create one first.');
  }

  console.log('Start seeding quizzes...');
  
  for (const quizData of quizzes) {
    try {
      // Create the quiz with proper types
      const quiz = await prisma.quiz.create({
        data: {
          title: quizData.title,
          description: quizData.description,
          topic: quizData.topic,
          difficulty: quizData.difficulty,
          isPremium: quizData.isPremium,
          published: quizData.published,
          totalQuestions: quizData.totalQuestions,
          timeLimit: quizData.timeLimit,
          user: {
            connect: {
              id: defaultUser.id
            }
          },
          questions: {
            create: quizData.questions.map(q => ({
              question: q.question,
              options: Array.isArray(q.options) ? q.options : [q.options],
              correctAnswer: q.correctAnswer,
              explanation: q.explanation
            }))
          }
        }
      });

      console.log(`Created quiz: ${quiz.title}`);
    } catch (error) {
      console.error(`Error creating quiz ${quizData.title}:`, error);
    }
  }
  
  console.log('Seeding quizzes finished.');
}

main()
  .catch((e) => {
    console.error('Error seeding quizzes:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
