import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'TEACHER') {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { topic, difficulty, numberOfQuestions, gradeLevel, totalMarks } = await req.json();

    if (!topic || !difficulty || !numberOfQuestions || !gradeLevel) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const marksPerQuestion = Math.floor((totalMarks || 100) / numberOfQuestions);

    const prompt = `Generate ${numberOfQuestions} multiple-choice questions about ${topic} for grade ${gradeLevel} students. 
    The difficulty level should be ${difficulty}. Each question is worth ${marksPerQuestion} marks.

    Format the response as a JSON object with this exact structure:
    {
      "title": "Assignment title",
      "description": "Brief description of the assignment",
      "questions": [
        {
          "question": "The question text",
          "options": ["A) First option", "B) Second option", "C) Third option", "D) Fourth option"],
          "correctAnswerIndex": 0,
          "explanation": "Explanation of why this answer is correct",
          "marks": ${marksPerQuestion}
        }
      ]
    }

    Requirements:
    1. Each question must have exactly 4 options
    2. Options must be prefixed with A), B), C), D)
    3. correctAnswerIndex must be 0-3 corresponding to the correct option
    4. Include a clear explanation for the correct answer
    5. Questions should be grade-appropriate and engaging
    6. Questions should test understanding, not just memorization
    7. Format must match the exact JSON structure shown above
    8. Each question is worth exactly ${marksPerQuestion} marks
    9. The options array must be a proper JSON array, not a string

    Example question:
    {
      "question": "What is the sum of the angles in a triangle?",
      "options": ["A) 90 degrees", "B) 180 degrees", "C) 270 degrees", "D) 360 degrees"],
      "correctAnswerIndex": 1,
      "explanation": "The sum of angles in a triangle is always 180 degrees. This is a fundamental property of triangles that can be proven using parallel lines and corresponding angles.",
      "marks": ${marksPerQuestion}
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI that generates high-quality educational content. Always format your responses exactly as requested.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const response = completion.choices[0].message?.content;
    if (!response) {
      throw new Error("No response from OpenAI");
    }

    try {
      const parsedResponse = JSON.parse(response);
      return NextResponse.json(parsedResponse);
    } catch (error) {
      console.error("Failed to parse OpenAI response:", response);
      throw new Error("Invalid response format from OpenAI");
    }
  } catch (error) {
    console.error("[ASSIGNMENT_GENERATE]", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal server error",
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
