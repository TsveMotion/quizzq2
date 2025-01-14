import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import OpenAI from 'openai';
import { getQuizGenerationCount } from '@/lib/quiz-utils';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface QuizParams {
  subject: string;
  difficulty: string;
  year: string;
  questionCount: number;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const dailyCount = await getQuizGenerationCount(userId);

    if (dailyCount >= 5) {
      return NextResponse.json(
        { error: 'Daily quiz generation limit reached' },
        { status: 429 }
      );
    }

    const params = (await request.json()) as QuizParams;
    const { subject, difficulty, year, questionCount } = params;

    // Generate quiz using OpenAI
    const prompt = `Generate a ${difficulty} difficulty ${subject} quiz suitable for ${year} students with ${questionCount} multiple choice questions. Format the response as a JSON object with the following structure:
    {
      "title": "Quiz title",
      "topic": "${subject}",
      "questions": [
        {
          "question": "Question text",
          "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
          "correctAnswer": "Correct option text",
          "explanation": "Detailed explanation of why this answer is correct and why other options are incorrect"
        }
      ]
    }`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "gpt-3.5-turbo-1106",
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      return NextResponse.json({ error: 'No content generated' }, { status: 500 });
    }
    const quizData = JSON.parse(content);

    // Create quiz in database
    const quiz = await prisma.aIQuiz.create({
      data: {
        title: quizData.title,
        topic: quizData.topic,
        difficulty: difficulty,
        userId: userId,
        questions: {
          create: quizData.questions.map((q: any) => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation
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
