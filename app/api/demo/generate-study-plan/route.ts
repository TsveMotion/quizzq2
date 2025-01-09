import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { examDate, selectedSubjects, studyHours } = await req.json();

    const prompt = `Create a personalized study plan for a student preparing for exams. Details:
    - Exam Date: ${examDate}
    - Subjects: ${selectedSubjects.join(', ')}
    - Available Study Hours per Week: ${studyHours}

    Generate a structured study plan in JSON format with:
    1. Weekly schedule (what to study each day)
    2. Study recommendations
    3. Key milestones to track progress

    Format the response as:
    {
      "weeklySchedule": {
        "monday": ["task1", "task2"],
        "tuesday": ["task1", "task2"],
        ...
      },
      "recommendations": ["rec1", "rec2", ...],
      "milestones": ["milestone1", "milestone2", ...]
    }`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert study planner that creates personalized and effective study schedules."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const response = completion.choices[0].message.content;
    const parsedResponse = JSON.parse(response || '{}');

    return NextResponse.json({
      success: true,
      ...parsedResponse
    });

  } catch (error) {
    console.error('Study plan generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate study plan' },
      { status: 500 }
    );
  }
}
