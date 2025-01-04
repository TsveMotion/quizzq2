import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  try {
    const token = cookies().get('token')?.value;
    
    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const session = await verifyAuth(token);
    
    if (!session || session.role !== 'teacher') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const assignments = await prisma.assignment.findMany({
      where: {
        teacherId: session.userId,
      },
      include: {
        class: true,
        submissions: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const token = cookies().get('token')?.value;
    
    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const session = await verifyAuth(token);
    
    if (!session || session.role !== 'teacher') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { title, classId, dueDate, subject, topic, yearGroup, complexity, questionCount } = await req.json();

    if (!title || !classId || !dueDate || !subject || !topic || !yearGroup || !complexity || !questionCount) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Verify the class belongs to this teacher
    const classExists = await prisma.class.findFirst({
      where: {
        id: classId,
        teacherId: session.userId,
      },
    });

    if (!classExists) {
      return new NextResponse('Class not found', { status: 404 });
    }

    // Generate quiz questions using OpenAI GPT-3.5-turbo
    const prompt = `Create a ${complexity} level quiz for ${subject} about ${topic}, suitable for Year ${yearGroup} students in the UK education system.

    Requirements:
    1. Generate exactly ${questionCount} questions
    2. Each question should be multiple choice with 4 options
    3. Format MUST strictly follow the JSON structure below
    4. Questions should be for Year ${yearGroup} (${yearGroup >= 12 ? 'A-Level' : yearGroup >= 10 ? 'GCSE' : 'Key Stage 3'}) students
    5. Questions should be ${complexity} difficulty level

    Required JSON Format:
    {
      "questions": [
        {
          "questionText": "The actual question text goes here?",
          "optionA": "First option",
          "optionB": "Second option",
          "optionC": "Third option",
          "optionD": "Fourth option",
          "correctOption": "A",
          "explanation": "Detailed explanation of why this answer is correct"
        }
      ]
    }

    Make sure:
    - Questions are age-appropriate for Year ${yearGroup}
    - Content aligns with UK curriculum
    - Questions are clear and well-structured
    - Difficulty increases progressively
    - Each question tests different aspects of the topic
    - All explanations are thorough and educational

    IMPORTANT: Response MUST be valid JSON following the exact format above.`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an experienced UK education system teacher creating a quiz. You must return ONLY valid JSON in the specified format, with no additional text or markdown."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 2500,
    });

    let quizContent;
    let questions;

    try {
      const response = completion.choices[0].message.content || '';
      const parsedResponse = JSON.parse(response);
      questions = parsedResponse.questions;
      quizContent = response; // Store original JSON response
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      return new NextResponse('Failed to generate valid quiz questions', { status: 500 });
    }

    // Create the assignment in the database
    const assignment = await prisma.assignment.create({
      data: {
        title,
        content: quizContent,
        dueDate: new Date(dueDate),
        teacher: {
          connect: {
            id: session.userId
          }
        },
        class: {
          connect: {
            id: classId
          }
        },
        questions: {
          create: questions.map((q: any) => ({
            questionText: q.questionText,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correctOption: q.correctOption,
            explanation: q.explanation,
          }))
        }
      },
      include: {
        class: true,
        questions: true
      },
    });

    return NextResponse.json(assignment);
  } catch (error) {
    console.error('Error creating assignment:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
