import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { question, answer, subject, topic } = await req.json();

    const prompt = `As an AI tutor, provide feedback on the following answer:

Question (${subject} - ${topic}): ${question}
Student's Answer: ${answer}

Provide feedback in JSON format with:
1. A detailed analysis of the answer
2. Specific areas of improvement
3. Helpful hints for better understanding

Format the response as:
{
  "feedback": "Detailed feedback text",
  "hints": ["Hint 1", "Hint 2", "Hint 3"]
}`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful and encouraging AI tutor that provides constructive feedback to help students learn and improve."
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
    console.error('Feedback generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate feedback' },
      { status: 500 }
    );
  }
}
