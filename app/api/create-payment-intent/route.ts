import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { plan } = body;

    // Get the price based on the plan
    let amount = 399; // Default to £3.99 for Student Pro
    if (plan !== 'Student Pro') {
      throw new Error('Invalid plan selected');
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in pence
      currency: 'gbp',
      metadata: {
        plan,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Payment intent creation failed:', error);
    return NextResponse.json(
      { error: 'Payment intent creation failed' },
      { status: 500 }
    );
  }
}
