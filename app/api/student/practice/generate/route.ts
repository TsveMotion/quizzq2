import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const QUIZ_GENERATION_PROMPT = `Generate a multiple choice quiz with the following specifications:
- Subject: {subject}
- Topic: {topic}
- Number of questions: {numberOfQuestions}
- Difficulty level: {difficulty}

For each question, provide:
1. The question text
2. Four multiple choice options (A, B, C, D)
3. The correct answer (as a number 0-3, where 0=A, 1=B, 2=C, 3=D)

Format your response as a JSON array of questions, like this:
[
  {
    "question": "What is...",
    "options": ["option A", "option B", "option C", "option D"],
    "correctOption": 0
  }
]

Make sure:
- Questions are clear and concise
- All options are plausible
- Only one option is correct
- Questions test understanding, not just memorization
- Language is appropriate for the difficulty level`;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { subject, topic, numberOfQuestions, difficulty } = await req.json();

    const prompt = QUIZ_GENERATION_PROMPT
      .replace('{subject}', subject)
      .replace('{topic}', topic)
      .replace('{numberOfQuestions}', numberOfQuestions)
      .replace('{difficulty}', difficulty);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0].message.content;
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    try {
      const questions = JSON.parse(responseText);
      
      // Transform the response to match our expected format
      const formattedQuestions = questions.map((q: any) => ({
        questionText: q.question,
        optionA: q.options[0],
        optionB: q.options[1],
        optionC: q.options[2],
        optionD: q.options[3],
        correctOption: ['A', 'B', 'C', 'D'][q.correctOption],
        explanation: q.explanation || 'No explanation provided.'
      }));

      return NextResponse.json({ questions: formattedQuestions });
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      console.log('Raw response:', responseText);
      return NextResponse.json({ error: 'Failed to parse quiz questions' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error generating quiz:', error);
    return NextResponse.json(
      { error: 'Failed to generate quiz' },
      { status: 500 }
    );
  }
}
