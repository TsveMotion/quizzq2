import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('STRIPE_WEBHOOK_SECRET is not set');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return new NextResponse('No signature', { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const subscription = event.data.object as Stripe.Subscription;

  try {
    switch (event.type) {
      case 'customer.subscription.created':
        // When subscription is created, we don't update role yet as payment might not be confirmed
        break;

      case 'customer.subscription.updated':
      case 'customer.subscription.resumed':
        if (subscription.status === 'active') {
          // Update user role to pro
          await prisma.user.update({
            where: {
              id: subscription.metadata.userId,
            },
            data: {
              role: 'pro',
            },
          });
        }
        break;

      case 'customer.subscription.deleted':
      case 'customer.subscription.paused':
        // Revert to free tier
        await prisma.user.update({
          where: {
            id: subscription.metadata.userId,
          },
          data: {
            role: 'free',
          },
        });
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new NextResponse('Webhook handler failed', { status: 500 });
  }
}
