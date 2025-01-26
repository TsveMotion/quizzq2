import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        powerLevel: true,
        status: true,
        email_verified: true,
        image: true,
        schoolId: true,
        teacherId: true,
        isPro: true,
        proSubscriptionId: true,
        proExpiresAt: true,
        proType: true,
        proStatus: true,
        proPlan: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { name, email } = data;

    // Verify email is not already taken if it's being changed
    if (email && email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });
      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already taken' },
          { status: 400 }
        );
      }
    }

    // Update user
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(email && { email_verified: null }) // Reset email verification if email is changed
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        email_verified: true,
        image: true,
        powerLevel: true,
        isPro: true,
        proSubscriptionId: true,
        proExpiresAt: true,
        proType: true,
        proStatus: true,
        proPlan: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // Return updated user data
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    );
  }
}
