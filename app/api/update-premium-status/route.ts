import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import prisma from "@/lib/prisma";
import { Role } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { paymentIntentId } = await req.json();
    const currentDate = new Date();
    const expiryDate = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

    console.log('Updating premium status for user:', session.user.email);
    console.log('Payment Intent ID:', paymentIntentId);

    // Update user in database
    try {
      const updatedUser = await prisma.user.update({
        where: { email: session.user.email },
        data: {
          isPro: true,
          role: Role.PROUSER,
          proStatus: "active",
          proType: "premium",
          proPlan: "premium",
          proPlanName: "Premium Plan",
          proPlanPrice: 3.99,
          proPlanCurrency: "gbp",
          proPlanInterval: "month",
          proPlanIsActive: true,
          proPlanStartedAt: currentDate,
          proExpiresAt: expiryDate,
          proSubscriptionId: paymentIntentId,
        },
        select: {
          email: true,
          isPro: true,
          role: true,
          proStatus: true,
          proType: true,
          proPlan: true,
          proPlanName: true,
          proPlanPrice: true,
          proPlanCurrency: true,
          proPlanInterval: true,
          proPlanIsActive: true,
          proPlanStartedAt: true,
          proExpiresAt: true,
          proSubscriptionId: true,
        }
      });

      console.log('User updated successfully:', {
        email: updatedUser.email,
        isPro: updatedUser.isPro,
        role: updatedUser.role,
        proStatus: updatedUser.proStatus
      });

      // Update session data
      if (session.user) {
        session.user.isPro = true;
        session.user.role = Role.PROUSER;
        session.user.proStatus = "active";
      }

      return NextResponse.json({ 
        success: true, 
        user: updatedUser
      });
    } catch (dbError) {
      console.error("Database error while updating user:", dbError);
      return NextResponse.json(
        { error: "Failed to update user in database" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error updating premium status:", error);
    return NextResponse.json(
      { error: "Failed to update premium status" },
      { status: 500 }
    );
  }
}
