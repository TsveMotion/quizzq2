import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const API_URL = 'https://api.openai.com/v1/chat/completions';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { topic, prompt, grade, yearGroup, questionsCount } = await req.json();

    if (!topic || !prompt || !grade || !yearGroup || !questionsCount) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an expert quiz generator for ${grade} students in ${yearGroup}, focusing on the topic: ${topic}.
    Create a quiz with ${questionsCount} multiple-choice questions based on the following instructions: ${prompt}
    
    Ensure the questions are appropriate for:
    - Grade Level: ${grade}
    - Year Group: ${yearGroup}
    - Topic: ${topic}
    
    Format your response as a JSON object with this structure:
    {
      "questions": [
        {
          "question": "The question text",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": "The correct option",
          "explanation": "Detailed explanation of why this is the correct answer"
        }
      ]
    }
    
    Make sure each question:
    1. Is clear and unambiguous
    2. Has exactly 4 options
    3. Has one clearly correct answer
    4. Includes a detailed explanation
    5. Is appropriate for the specified grade level and year group
    6. Follows curriculum standards for the given grade`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate quiz');
    }

    const data = await response.json();
    const quizContent = JSON.parse(data.choices[0].message.content);

    // Add to quiz history
    // TODO: Implement quiz history storage in database

    return NextResponse.json(quizContent);
  } catch (error) {
    console.error('Error generating quiz:', error);
    return NextResponse.json(
      { error: 'Failed to generate quiz' },
      { status: 500 }
    );
  }
}
