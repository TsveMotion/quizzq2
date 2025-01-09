import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '../lib/prisma';
import { Role } from '../lib/enums';

export async function proAuthMiddleware(req: NextRequest) {
  const token = await getToken({ req });

  if (!token?.email) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'Authentication required' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: token.email },
  });

  if (!user?.isPro || user.role !== Role.PROUSER || !user.proSubscriptionId) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'PRO subscription required' }),
      { status: 403, headers: { 'content-type': 'application/json' } }
    );
  }

  // Check if subscription has expired or is inactive
  if (
    !user.proPlanIsActive || 
    (user.proExpiresAt && user.proExpiresAt < new Date())
  ) {
    // Update user subscription status
    await prisma.user.update({
      where: { email: token.email },
      data: {
        isPro: false,
        role: Role.USER,
        proStatus: 'expired',
        proPlanIsActive: false,
        proPlanEndedAt: new Date(),
      },
    });

    return new NextResponse(
      JSON.stringify({ success: false, message: 'PRO subscription has expired' }),
      { status: 403, headers: { 'content-type': 'application/json' } }
    );
  }

  return NextResponse.next();
}
