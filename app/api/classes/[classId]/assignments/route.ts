import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { cookies } from 'next/headers';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to generate questions using OpenAI
async function generateQuestions(topic: string, difficulty: string, numQuestions: number) {
  const prompt = `Generate ${numQuestions} multiple-choice questions about ${topic} at a ${difficulty} difficulty level. 
  Format each question as a JSON object with the following structure:
  {
    "question": "The question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "The correct option (A, B, C, or D)",
    "explanation": "A brief explanation of why this is the correct answer"
  }
  Return an array of these question objects.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI that generates educational quiz questions. Always format your response as valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response);
  } catch (error) {
    console.error('Error generating questions:', error);
    throw new Error('Failed to generate questions');
  }
}

// POST /api/classes/[classId]/assignments - Create a new assignment
export async function POST(
  req: Request,
  { params }: { params: { classId: string } }
) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userData = await verifyAuth(token);
    if (!userData || userData.role !== 'teacher') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the teacher owns this class
    const classRecord = await prisma.class.findUnique({
      where: {
        id: params.classId,
        teacherId: userData.userId,
      },
    });

    if (!classRecord) {
      return NextResponse.json(
        { error: 'Class not found or unauthorized' },
        { status: 404 }
      );
    }

    const { title, description, dueDate, topic, difficulty, numQuestions } = await req.json();

    // Generate questions using OpenAI
    console.log('Generating questions for topic:', topic);
    const questions = await generateQuestions(topic, difficulty, numQuestions);
    console.log('Generated questions:', questions);

    // Create the assignment with stringified questions
    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        questions: JSON.stringify(questions), // Convert questions to string
        classId: params.classId,
        creatorId: userData.userId,
      },
    });

    // Parse questions back to JSON when returning the response
    return NextResponse.json({
      assignment: {
        ...assignment,
        questions: JSON.parse(assignment.questions),
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to create assignment:', error);
    return NextResponse.json(
      { error: 'Failed to create assignment: ' + error.message },
      { status: 500 }
    );
  }
}

// GET /api/classes/[classId]/assignments - Get all assignments for a class
export async function GET(
  req: Request,
  { params }: { params: { classId: string } }
) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userData = await verifyAuth(token);
    if (!userData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has access to this class
    const classAccess = await prisma.class.findUnique({
      where: {
        id: params.classId,
        OR: [
          { teacherId: userData.userId },
          { students: { some: { id: userData.userId } } },
        ],
      },
    });

    if (!classAccess) {
      return NextResponse.json(
        { error: 'Class not found or unauthorized' },
        { status: 404 }
      );
    }

    const assignments = await prisma.assignment.findMany({
      where: {
        classId: params.classId,
        published: true,
      },
      include: {
        submissions: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Parse questions from string to JSON for each assignment
    const parsedAssignments = assignments.map(assignment => ({
      ...assignment,
      questions: JSON.parse(assignment.questions),
    }));

    return NextResponse.json({ assignments: parsedAssignments });
  } catch (error) {
    console.error('Failed to fetch assignments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assignments' },
      { status: 500 }
    );
  }
}
