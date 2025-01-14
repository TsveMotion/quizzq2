import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const message = await prisma.anonymousChat.update({
      where: { id: params.id },
      data: {
        likes: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error liking message:', error);
    return NextResponse.json(
      { error: 'Failed to like message' },
      { status: 500 }
    );
  }
}
