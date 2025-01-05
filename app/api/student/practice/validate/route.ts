import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import OpenAI from 'openai';
import prisma from '@/lib/prisma';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { quizId, answers } = await req.json();

    // Fetch the quiz with questions
    const quiz = await prisma.practiceQuiz.findUnique({
      where: {
        id: quizId,
        studentId: session.user.id,
      },
      include: {
        questions: true,
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // Prepare questions and answers for AI validation
    const questionsWithAnswers = quiz.questions.map((q, index) => {
      const options = JSON.parse(q.optionsJson);
      const studentAnswer = answers[q.id];
      return {
        question: q.question,
        options,
        correctOption: q.correctOption,
        studentAnswer: studentAnswer !== undefined ? options[studentAnswer] : 'No answer',
        correctAnswer: options[q.correctOption],
      };
    });

    const prompt = `Please evaluate the following quiz answers:

${questionsWithAnswers.map((q, i) => `
Question ${i + 1}: ${q.question}
Student's Answer: ${q.studentAnswer}
Correct Answer: ${q.correctAnswer}
`).join('\n')}

For each question, provide:
1. Whether the answer is correct (true/false)
2. A brief explanation of why the answer is correct or incorrect
3. A helpful tip for understanding the concept better

Format your response as a JSON array like this:
[
  {
    "correct": true/false,
    "explanation": "explanation text",
    "tip": "helpful tip"
  }
]`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an educational assistant helping to evaluate quiz answers. Provide clear, constructive feedback that helps students learn from their mistakes."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from AI');
    }

    try {
      // Clean up the response
      const cleanResponse = response
        .replace(/```json\s*/g, '')
        .replace(/```\s*$/g, '')
        .trim();
      
      const feedback = JSON.parse(cleanResponse);
      
      // Calculate score
      const score = questionsWithAnswers.reduce((acc, q, i) => {
        return acc + (q.correctOption === answers[q.id] ? 1 : 0);
      }, 0);

      const totalQuestions = quiz.questions.length;
      const percentage = Math.round((score / totalQuestions) * 100);

      return NextResponse.json({
        score,
        totalQuestions,
        percentage,
        feedback,
        questionsWithAnswers,
      });
    } catch (error) {
      console.error('Failed to parse AI response:', response);
      throw new Error('Invalid response format from AI');
    }
  } catch (error) {
    console.error('Error validating quiz answers:', error);
    return NextResponse.json(
      { error: 'Failed to validate answers' },
      { status: 500 }
    );
  }
}
