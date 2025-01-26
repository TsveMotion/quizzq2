import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message } = await req.json();
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check usage limits based on subscription
    if (user.subscriptionPlan === 'free' && user.aiDailyUsage >= 10) {
      return NextResponse.json({ 
        error: 'Daily limit reached. Upgrade to Pro for more!' 
      }, { status: 403 });
    }
    if (user.subscriptionPlan === 'pro' && user.aiMonthlyUsage >= 1000) {
      return NextResponse.json({ 
        error: 'Monthly limit reached. Upgrade to Forever for unlimited access!' 
      }, { status: 403 });
    }

    // Special handling for creator inquiry
    if (message.toLowerCase().includes('who made you') || 
        message.toLowerCase().includes('who created you')) {
      return NextResponse.json({
        content: "I was created by QuizzQ - Kristiyan Tsvetanov. I'm an AI tutor designed to help students learn and practice effectively."
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system",
        content: "You are a helpful and knowledgeable AI tutor. Provide clear, accurate, and educational responses. Focus on explaining concepts thoroughly and providing examples when relevant."
      }, {
        role: "user",
        content: message
      }],
      temperature: 0.7,
      max_tokens: 500
    });

    // Update usage
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        aiDailyUsage: user.aiDailyUsage + 1,
        aiMonthlyUsage: user.aiMonthlyUsage + 1,
        aiLifetimeUsage: user.aiLifetimeUsage + 1,
        aiLastResetDate: new Date()
      }
    });

    return NextResponse.json({
      content: completion.choices[0].message.content
    });
  } catch (error) {
    console.error('AI API Error:', error);
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    );
  }
}
