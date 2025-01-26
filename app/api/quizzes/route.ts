import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';
import { OpenAI } from 'openai';
import { getQuizGenerationCount } from '@/lib/quiz-utils';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const dailyCount = await getQuizGenerationCount(userId);

    const quizzes = await prisma.aIQuiz.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        title: true,
        topic: true,
        questions: {
          select: {
            id: true,
            question: true,
            options: true,
            correctAnswer: true,
          },
        },
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ quizzes, dailyCount });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quizzes' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check daily limit
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dailyCount = await prisma.aIQuiz.count({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    if (dailyCount >= 5) {
      return NextResponse.json(
        { error: 'Daily quiz generation limit reached' },
        { status: 429 }
      );
    }

    // Generate quiz using OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    const systemPrompt = "You are a quiz generator. Create a quiz with 5 multiple-choice questions. The response should be in JSON format with the following structure: { title: string, topic: string, questions: Array<{ question: string, options: string[], correctAnswer: string, explanation: string }> }";
    const prompt = "Generate a quiz about a random interesting topic.";
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ]
    });

    const quizData = JSON.parse(completion.choices[0].message?.content || '{}');

    // Save quiz to database
    const quiz = await prisma.aIQuiz.create({
      data: {
        title: quizData.title,
        topic: quizData.topic,
        userId: session.user.id,
        questions: {
          create: quizData.questions.map((q: any) => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
          })),
        },
      },
      include: {
        questions: true,
      },
    });

    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Error generating quiz:', error);
    return NextResponse.json(
      { error: 'Failed to generate quiz' },
      { status: 500 }
    );
  }
}
