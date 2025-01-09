import { PrismaClient, Prisma } from '@prisma/client';
import { quizzes } from '../prisma/quizSeed';

const prisma = new PrismaClient();

async function seedQuizzes() {
  console.log('Start seeding quizzes...');
  
  for (const quizData of quizzes) {
    const { questions, ...quizInfo } = quizData;
    
    try {
      // Create the quiz
      const quiz = await prisma.quiz.create({
        data: {
          ...quizInfo
        }
      });

      // Create questions for the quiz
      for (const question of questions) {
        const { options, ...questionData } = question;
        await prisma.quizQuestion.create({
          data: {
            ...questionData,
            options: options as Prisma.InputJsonValue,
            quizId: quiz.id
          }
        });
      }
      
      console.log(`Created quiz: ${quiz.title}`);
    } catch (error) {
      console.error(`Error creating quiz ${quizData.title}:`, error);
    }
  }
  
  console.log('Seeding quizzes finished.');
}

seedQuizzes()
  .catch((error) => {
    console.error('Error seeding quizzes:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
