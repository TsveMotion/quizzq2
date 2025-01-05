import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import OpenAI from 'openai';
import prisma from '@/lib/prisma';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(
  req: Request,
  { params }: { params: { teacherId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.id !== params.teacherId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, subject, topic, numberOfQuestions } = await req.json();

    if (!title || !subject || !topic || !numberOfQuestions) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate quiz using OpenAI
    const systemPrompt = `You are a helpful teacher creating educational quizzes. 
    You must respond with a valid JSON object containing a 'questions' array in this exact format:
    {
      "questions": [
        {
          "question": "What is X?",
          "options": ["A", "B", "C", "D"],
          "correctAnswer": 0,
          "explanation": "A is correct because..."
        }
      ]
    }`;

    const userPrompt = `Create ${numberOfQuestions} multiple-choice questions about ${topic} in ${subject}.
    Requirements:
    1. Return EXACTLY ${numberOfQuestions} questions
    2. Each question MUST have EXACTLY 4 options
    3. The correctAnswer MUST be a number 0-3 indicating the index of the correct option
    4. Include a clear explanation for each answer
    5. Make questions appropriate for school students
    6. Format as a JSON object with a 'questions' array`;

    console.log('Sending request to OpenAI...');
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const response = completion.choices[0]?.message?.content;
    console.log('OpenAI Response:', response);

    if (!response) {
      throw new Error('No response from OpenAI');
    }

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse OpenAI response:', error);
      console.error('Raw response:', response);
      throw new Error('Failed to parse generated quiz - invalid JSON');
    }

    if (!parsedResponse || !Array.isArray(parsedResponse.questions)) {
      console.error('Invalid response format:', parsedResponse);
      throw new Error('Invalid response format - missing questions array');
    }

    const questions = parsedResponse.questions;

    // Validate each question
    const formattedQuestions = questions.map((q: any, index: number) => {
      if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 || 
          typeof q.correctAnswer !== 'number' || !q.explanation) {
        console.error(`Invalid question format at index ${index}:`, q);
        throw new Error(`Invalid question format at index ${index}`);
      }

      return {
        question: q.question,
        options: q.options,
        correctAnswerIndex: q.correctAnswer,
        explanation: q.explanation
      };
    });

    if (formattedQuestions.length !== parseInt(numberOfQuestions)) {
      throw new Error(`Expected ${numberOfQuestions} questions but got ${formattedQuestions.length}`);
    }

    return NextResponse.json({ questions: formattedQuestions });
  } catch (error: any) {
    console.error('Error generating assignment:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate assignment',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
