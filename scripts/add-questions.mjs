import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Add questions to the "Exploring Pi with Math Circles" assignment
  await prisma.quizQuestion.createMany({
    data: [
      {
        assignmentId: 'cm5kyjyxw000155ic12uhuowu',
        question: 'What is the approximate value of Pi?',
        options: JSON.stringify(['3.14', '3.41', '3.12', '3.24']),
        correctAnswerIndex: 0,
        explanation: 'Pi is approximately equal to 3.14159...'
      },
      {
        assignmentId: 'cm5kyjyxw000155ic12uhuowu',
        question: 'How many digits of Pi have been calculated?',
        options: JSON.stringify(['1 million', '10 billion', '100 trillion', 'Over 31.4 trillion']),
        correctAnswerIndex: 3,
        explanation: 'As of 2024, over 31.4 trillion digits of Pi have been calculated.'
      },
      {
        assignmentId: 'cm5kyjyxw000155ic12uhuowu',
        question: 'What is the relationship between a circle\'s circumference and its diameter?',
        options: JSON.stringify([
          'Circumference = Pi × Diameter',
          'Circumference = Pi × Radius',
          'Circumference = 2 × Radius',
          'Circumference = 2 × Diameter'
        ]),
        correctAnswerIndex: 0,
        explanation: 'The circumference of a circle is equal to Pi times its diameter.'
      }
    ]
  });

  console.log('Questions added successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
