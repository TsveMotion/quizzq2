import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAuth } from '@/lib/auth';
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const token = cookies().get('token')?.value;
    
    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const session = await verifyAuth(token);
    
    if (!session || session.role !== 'student') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { subject, topic, numberOfQuestions, complexity, ageGroup } = await req.json();

    if (!subject || !topic || !numberOfQuestions || !complexity || !ageGroup) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const prompt = `Create a quiz with the following specifications:
- Subject: ${subject}
- Topic: ${topic}
- Number of questions: ${numberOfQuestions}
- Complexity level: ${complexity} (1-5)
- Year group: ${ageGroup}

Create questions that are:
1. Appropriate for ${ageGroup} students
2. Aligned with the UK curriculum for this year group
3. At complexity level ${complexity} where:
   - Level 1: Basic recall and understanding
   - Level 2: Application of concepts
   - Level 3: Analysis and implementation
   - Level 4: Evaluation and synthesis
   - Level 5: Advanced problem-solving and critical thinking

For each question, provide:
1. A clear, curriculum-aligned question
2. Four distinct multiple-choice options (A, B, C, D)
3. The correct answer
4. A detailed explanation that helps the student understand why it's correct

Format the response as a JSON array of objects with the following structure:
{
  "questions": [
    {
      "questionText": "string",
      "optionA": "string",
      "optionB": "string",
      "optionC": "string",
      "optionD": "string",
      "correctOption": "A|B|C|D",
      "explanation": "string"
    }
  ]
}

Make sure all questions:
1. Are challenging but achievable for ${ageGroup} students
2. Follow UK curriculum standards for this year group
3. Build subject understanding progressively
4. Include clear, concise explanations
5. Avoid overly complex language while maintaining academic rigor`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "You are an expert educator who creates high-quality, engaging quiz questions. Always ensure questions are clear, accurate, and appropriate for the specified age group and complexity level."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('Failed to generate quiz questions');
    }

    const parsedResponse = JSON.parse(response);
    return NextResponse.json(parsedResponse);
  } catch (error) {
    console.error('Practice Quiz Generation Error:', error);
    return new NextResponse(
      error instanceof Error ? error.message : 'Internal Server Error', 
      { status: 500 }
    );
  }
}
