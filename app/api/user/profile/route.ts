import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

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
        emailVerified: true,
        image: true,
        schoolId: true,
        teacherId: true,
        avatar: true,
        bio: true,
        subjects: true,
        education: true,
        experience: true,
        phoneNumber: true,
        officeHours: true,
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
    const { name, bio, avatar, subjects, education, experience, phoneNumber, officeHours } = data;

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        bio,
        avatar,
        subjects,
        education,
        experience,
        phoneNumber,
        officeHours
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        powerLevel: true,
        status: true,
        emailVerified: true,
        image: true,
        schoolId: true,
        teacherId: true,
        avatar: true,
        bio: true,
        subjects: true,
        education: true,
        experience: true,
        phoneNumber: true,
        officeHours: true,
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

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    );
  }
}
