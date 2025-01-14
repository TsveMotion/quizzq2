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

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const userId = paymentIntent.metadata.userId;
        const planType = paymentIntent.metadata.planType;

        if (!userId) {
          console.error('No userId in payment intent metadata');
          return new NextResponse('No userId found', { status: 400 });
        }

        console.log('Updating user:', userId, 'to plan:', planType);

        // Update user based on plan type
        await prisma.user.update({
          where: { id: userId },
          data: {
            role: planType === 'forever' ? 'ADMIN' : 'PRO',
            subscriptionStatus: 'active',
            subscriptionPlan: planType,
            subscriptionId: paymentIntent.id,
            subscriptionEndDate: planType === 'forever' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days for pro plan
            updatedAt: new Date(),
          },
        });

        console.log('Successfully updated user subscription');
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata.userId;

        if (!userId) {
          console.error('No userId in subscription metadata');
          return new NextResponse('No userId found', { status: 400 });
        }

        console.log('Processing subscription for user:', userId);

        if (subscription.status === 'active') {
          await prisma.user.update({
            where: { id: userId },
            data: {
              role: 'PRO',
              subscriptionStatus: 'active',
              subscriptionPlan: 'pro',
              subscriptionId: subscription.id,
              subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
              updatedAt: new Date(),
            },
          });
          console.log('Successfully activated subscription');
        }
        break;
      }

      case 'customer.subscription.deleted':
      case 'customer.subscription.paused': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata.userId;

        if (!userId) {
          console.error('No userId in subscription metadata');
          return new NextResponse('No userId found', { status: 400 });
        }

        console.log('Deactivating subscription for user:', userId);

        await prisma.user.update({
          where: { id: userId },
          data: {
            role: 'USER',
            subscriptionStatus: 'inactive',
            subscriptionEndDate: new Date(),
            updatedAt: new Date(),
          },
        });

        console.log('Successfully deactivated subscription');
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new NextResponse('Webhook handler failed', { status: 500 });
  }
}
