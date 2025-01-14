import prisma from './prisma';

export async function getQuizGenerationCount(userId: string): Promise<number> {
  // Get today's date range
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Count quizzes created today
  const count = await prisma.aIQuiz.count({
    where: {
      userId: userId,
      createdAt: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  return count;
}
