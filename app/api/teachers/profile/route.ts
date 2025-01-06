import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        subjects: true,
        education: true,
        experience: true,
        phoneNumber: true,
        officeHours: true,
      }
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Parse JSON fields
    const profile = {
      ...user,
      subjects: user.subjects ? JSON.parse(user.subjects) : [],
      officeHours: user.officeHours ? JSON.parse(user.officeHours) : [],
      preferences: {
        theme: 'system',
        emailNotifications: true,
        pushNotifications: true,
        language: 'en',
        timezone: 'UTC',
      }
    };

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching teacher profile:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await request.json();

    const user = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        name: data.name,
        avatar: data.avatar,
        bio: data.bio,
        subjects: Array.isArray(data.subjects) ? JSON.stringify(data.subjects) : data.subjects,
        education: data.education,
        experience: data.experience,
        phoneNumber: data.phoneNumber,
        officeHours: Array.isArray(data.officeHours) ? JSON.stringify(data.officeHours) : data.officeHours,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        subjects: true,
        education: true,
        experience: true,
        phoneNumber: true,
        officeHours: true,
      }
    });

    // Parse JSON fields for response
    const profile = {
      ...user,
      subjects: user.subjects ? JSON.parse(user.subjects) : [],
      officeHours: user.officeHours ? JSON.parse(user.officeHours) : [],
      preferences: {
        theme: 'system',
        emailNotifications: true,
        pushNotifications: true,
        language: 'en',
        timezone: 'UTC',
      }
    };

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error updating teacher profile:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
