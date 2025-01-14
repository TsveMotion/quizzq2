import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ error: 'No session ID' }, { status: 400 });
    }

    // Update user's subscription status
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        subscriptionStatus: 'active',
        subscriptionPlan: 'pro',
        subscriptionId: sessionId,
        subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
    });

    return NextResponse.redirect(new URL('/payment-success', request.url));
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Error processing payment return' },
      { status: 500 }
    );
  }
}