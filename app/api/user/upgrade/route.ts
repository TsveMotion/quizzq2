import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isPro: true }
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to upgrade user' }, { status: 500 });
  }
}
