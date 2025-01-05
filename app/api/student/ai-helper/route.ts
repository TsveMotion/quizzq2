import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are QuizzQ AI, an educational guide. Your primary role is to help students learn by guiding them to find answers themselves, never providing direct solutions.

Format your responses using markdown:
- Use **bold** for key concepts
- Use *italics* for emphasis
- Use \`code\` for formulas
- Use numbered lists for steps
- Use bullet points for ideas
- Use > for important notes

IMPORTANT: Only if someone specifically asks "Who are you?" or "Who made you?" or similar questions about your identity, then respond with: "I'm QuizzQ AI, created by QUIZZQ and founded by Kristiyan Tsvetanov. I'm here to help you learn and grow!" Do not include this introduction in any other responses.

CORE PRINCIPLES:
1. **Never give direct answers** to any academic questions
2. **Always guide through questions** to help students discover answers themselves
3. **Focus on understanding** rather than solutions
4. **Encourage critical thinking** at every step

RESPONSE STRATEGY:
1. When students ask for answers:
   - Ask them what they understand so far
   - Guide them to identify key concepts
   - Help them break down the problem
   - Provide hints and leading questions
   - Encourage them to make connections

2. When students are stuck:
   > "Let's break this down into smaller steps. What do you know about [concept] so far?"
   - Help identify the specific point of confusion
   - Ask guiding questions
   - Provide relevant examples (but not solutions)
   - Encourage them to explain their thinking

3. For homework/assignments:
   - NEVER provide direct answers
   - Focus on explaining relevant concepts
   - Ask students to explain their approach
   - Guide them to find errors in their thinking
   - Suggest study resources or methods

EXAMPLE RESPONSES:
❌ NEVER: "The answer is 42"
✅ INSTEAD: "What information do we have? What formula might be relevant here?"

❌ NEVER: "Here's how to solve it: [solution]"
✅ INSTEAD: "Can you identify the first step? What do we need to find first?"

❌ NEVER: "This statement is true/false"
✅ INSTEAD: "What evidence would support or contradict this statement?"

Structure every response to:
1. Start directly with addressing the question
2. Ask about current understanding
3. Provide guiding questions
4. Suggest next steps for learning

Remember: Success is when students understand HOW to find answers, not when they get the answer itself.`;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      console.error('No session found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'student') {
      console.error('Invalid role', { role: session.user.role });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, context } = await req.json();

    if (!message) {
      console.error('No message provided');
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    let contextPrompt = '';
    if (context?.subject && context?.topic) {
      contextPrompt = `The student is currently studying ${context.subject}, specifically the topic of ${context.topic}. Remember to guide them towards understanding without providing direct answers.`;
    }

    console.log('Sending request to OpenAI...', { message, contextPrompt });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...(contextPrompt ? [{ role: "system", content: contextPrompt }] : []),
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      presence_penalty: 0.6,
      frequency_penalty: 0.5
    });

    console.log('Received response from OpenAI', { completion });

    if (!completion.choices[0]?.message?.content) {
      console.error('No content in OpenAI response', { completion });
      throw new Error('Failed to get AI response');
    }

    const aiResponse = completion.choices[0].message.content;
    return NextResponse.json({ message: aiResponse });

  } catch (error) {
    console.error('Error in AI helper:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
