import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";

// Check if STRIPE_SECRET_KEY is available
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.error("No authenticated user found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount } = await request.json();
    if (!amount || typeof amount !== 'number') {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    console.log("Creating payment intent for:", session.user.email);

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in pence
      currency: 'gbp',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: session.user.id,
        userEmail: session.user.email,
      },
      description: 'Premium Subscription',
    });

    console.log("Created payment intent:", paymentIntent.id);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Payment intent creation failed:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Payment intent creation failed',
        details: error instanceof Stripe.errors.StripeError ? error.type : undefined
      },
      { status: 500 }
    );
  }
}
