import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ROLES } from '@/lib/roles';

// PATCH /api/admin/users/[userId]/role - Update user role
export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { role } = await req.json();

    // Validate role
    if (!Object.values(ROLES).includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Get power level based on role
    const powerLevel = {
      [ROLES.MEMBER]: 1,
      [ROLES.STUDENT]: 2,
      [ROLES.TEACHER]: 3,
      [ROLES.SCHOOLADMIN]: 4,
      [ROLES.SUPERADMIN]: 5,
    }[role] || 1;

    const user = await prisma.user.update({
      where: {
        id: params.userId,
      },
      data: {
        role,
        powerLevel,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Failed to update user role:', error);
    return NextResponse.json(
      { error: 'Failed to update user role' },
      { status: 500 }
    );
  }
}
