import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(request: Request) {
  try {
    const { paymentIntent } = await request.json();

    // Retrieve the payment intent to verify its status
    const intent = await stripe.paymentIntents.retrieve(paymentIntent);

    if (intent.status === 'succeeded') {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Payment has not been completed' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Payment verification failed:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
