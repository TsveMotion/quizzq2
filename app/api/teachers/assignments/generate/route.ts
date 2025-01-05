import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'TEACHER') {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { subject, category, yearGroup, complexity, duration } = await request.json();

    const prompt = `Create an educational assignment with the following parameters:
Subject: ${subject}
Category: ${category}
Year Group: Year ${yearGroup}
Complexity: ${complexity}
Duration: ${duration} minutes

Please generate a structured assignment that follows this exact format:
TITLE: [The assignment title]

LEARNING OBJECTIVES:
- [Objective 1]
- [Objective 2]
- [Objective 3]

INSTRUCTIONS:
[Clear instructions for students]

MAIN CONTENT:
[The main assignment content, questions, or tasks]

RESOURCES NEEDED:
- [Resource 1]
- [Resource 2]

ASSESSMENT CRITERIA:
- [Criterion 1]
- [Criterion 2]
- [Criterion 3]

Make sure the content is appropriate for Year ${yearGroup} students and can be completed in ${duration} minutes.
Focus on making the content engaging and educational.`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an experienced educator specializing in creating engaging and effective educational assignments. Your assignments should be clear, well-structured, and appropriate for the specified year group and complexity level. Always maintain the exact format provided in the prompt.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.8,
      max_tokens: 1500,
      presence_penalty: 0.3,
      frequency_penalty: 0.3,
    });

    const generatedText = completion.choices[0].message.content;
    if (!generatedText) {
      throw new Error('Failed to generate assignment');
    }

    // Parse the generated text into title and content
    const titleMatch = generatedText.match(/TITLE:\s*(.+?)(?=\n\n)/s);
    const title = titleMatch ? titleMatch[1].trim() : 'Generated Assignment';
    const content = generatedText.replace(/TITLE:\s*.+?\n\n/s, '').trim();

    return NextResponse.json({
      title,
      content,
    });
  } catch (error) {
    console.error("[ASSIGNMENT_GENERATE]", error);
    return new NextResponse("Failed to generate assignment", { status: 500 });
  }
}
