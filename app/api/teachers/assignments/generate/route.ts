import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Question {
  type: 'multiple-choice' | 'match-up' | 'essay' | 'short-answer';
  prompt: string;
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
  rubric?: string;
}

interface GeneratedAssignment {
  title: string;
  description: string;
  questions: Question[];
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'TEACHER') {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { topic, questionTypes, difficulty, numberOfQuestions } = await request.json();

    // Simplified prompt for GPT-3.5-turbo
    const prompt = `Create an educational assignment about "${topic}" with ${numberOfQuestions} questions.
Include a mix of these types: ${questionTypes.join(', ')}. Difficulty: ${difficulty}.

Return a JSON object with this structure:
{
  "title": "Brief, engaging title",
  "description": "1-2 sentence description",
  "questions": [
    // Multiple choice example
    {
      "type": "multiple-choice",
      "prompt": "Clear question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "points": 5
    },
    // Match-up example
    {
      "type": "match-up",
      "prompt": "Match the items",
      "options": ["Left 1", "Left 2", "Left 3"],
      "correctAnswer": ["Right 1", "Right 2", "Right 3"],
      "points": 10
    },
    // Essay example
    {
      "type": "essay",
      "prompt": "Essay question",
      "points": 20,
      "rubric": "Key points to include: 1..., 2..., 3..."
    },
    // Short answer example
    {
      "type": "short-answer",
      "prompt": "Short question",
      "correctAnswer": "Expected answer",
      "points": 5
    }
  ]
}

Make the questions appropriate for ${difficulty} level and ensure JSON is valid.`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful teacher creating an educational assignment. Return only valid JSON matching the specified format.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 1000
    });

    const generatedText = completion.choices[0].message.content;
    if (!generatedText) {
      throw new Error('Failed to generate assignment');
    }

    try {
      const parsedAssignment = JSON.parse(generatedText.trim()) as GeneratedAssignment;
      return NextResponse.json(parsedAssignment);
    } catch (parseError) {
      console.error("Failed to parse OpenAI response:", parseError);
      throw new Error('Invalid assignment format returned from AI');
    }
  } catch (error) {
    console.error("[ASSIGNMENT_GENERATE]", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Failed to generate assignment",
      { status: 500 }
    );
  }
}

// AI Essay Grading Endpoint
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'TEACHER') {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { essayResponse, rubric, prompt } = await request.json();

    // Simplified prompt for GPT-3.5-turbo
    const gradePrompt = `Grade this essay:
Prompt: ${prompt}
Rubric: ${rubric}
Response: ${essayResponse}

Return a JSON object with this structure:
{
  "score": (number between 0-100),
  "feedback": "Brief overall feedback",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"]
}`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a fair teacher grading an essay. Return only valid JSON with the score and feedback.",
        },
        {
          role: "user",
          content: gradePrompt,
        },
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.3
    });

    const gradingResult = completion.choices[0].message.content;
    if (!gradingResult) {
      throw new Error('Failed to grade essay');
    }

    try {
      const parsedResult = JSON.parse(gradingResult.trim());
      return NextResponse.json(parsedResult);
    } catch (parseError) {
      console.error("Failed to parse grading result:", parseError);
      throw new Error('Invalid grading format returned from AI');
    }
  } catch (error) {
    console.error("[ESSAY_GRADE]", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Failed to grade essay",
      { status: 500 }
    );
  }
}
