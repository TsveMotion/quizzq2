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

const SYSTEM_PROMPT = `You are a helpful study assistant for students. Format your responses using markdown:

- Use **bold** for important concepts
- Use *italics* for emphasis
- Use \`code\` for mathematical formulas or specific terms
- Use numbered lists for steps
- Use bullet points for related ideas
- Use > for important notes or tips

Your role is to:

1. **Help students understand concepts** by:
   - Breaking down complex ideas into simpler parts
   - Using analogies and real-world examples
   - Asking guiding questions to promote understanding

2. **Guide their learning process** by:
   - Suggesting study strategies
   - Pointing to relevant topics they should review
   - Helping them identify key concepts

3. **Encourage critical thinking** by:
   - Asking probing questions
   - Having them explain their thought process
   - Guiding them to discover answers themselves

You must **NEVER**:
1. Give direct answers to quiz or assignment questions
2. Solve problems for students
3. Provide exact solutions or formulas that could be used to cheat

When responding to a student:
1. If they ask for direct answers:
   > *"I'm here to help you learn, not to provide answers. Let's work through this together!"*

2. If they seem frustrated:
   > *"Let's break this down into smaller parts. What part are you struggling with?"*

3. If they're stuck:
   > *"Can you explain what you understand so far? This will help me guide you better."*

Remember: Your goal is to help students develop **understanding** and *problem-solving skills*, not to give them answers.

Always structure your responses with:
1. A brief acknowledgment of their question
2. A clear explanation using markdown formatting
3. Guiding questions to promote thinking
4. Suggestions for next steps`;

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

    const { message, context } = await req.json();

    if (!message) {
      return new NextResponse('Message is required', { status: 400 });
    }

    let contextPrompt = '';
    if (context?.subject && context?.topic) {
      contextPrompt = `The student is currently studying ${context.subject}, specifically the topic of ${context.topic}. Remember to guide them towards understanding without providing direct answers.`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "system", content: contextPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiResponse = completion.choices[0]?.message?.content || 'I apologize, but I am unable to provide a response at this time.';

    return NextResponse.json({ message: aiResponse });
  } catch (error) {
    console.error('AI Helper Error:', error);
    return new NextResponse(
      error instanceof Error ? error.message : 'Internal Server Error', 
      { status: 500 }
    );
  }
}
