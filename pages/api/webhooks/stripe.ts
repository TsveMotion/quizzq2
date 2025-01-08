import { buffer } from 'micro';
import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature']!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Get subscription and plan details
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    const plan = subscription.items.data[0].price;
    const expiresAt = new Date(subscription.current_period_end * 1000);
    
    // Update user to PRO status
    const user = await prisma.user.update({
      where: {
        email: session.customer_email!,
      },
      data: {
        isPro: true,
        role: 'PRO', 
        proSubscriptionId: session.subscription as string,
        proExpiresAt: expiresAt,
        proType: 'subscription',
        proStatus: subscription.status,
        proPlan: plan.id,
        proPlanId: plan.id,
        proPlanName: plan.nickname || 'Pro Plan',
        proPlanPrice: plan.unit_amount ? plan.unit_amount / 100 : null,
        proPlanCurrency: plan.currency?.toUpperCase(),
        proPlanInterval: plan.recurring?.interval,
        proPlanTrialPeriodDays: plan.recurring?.trial_period_days || null,
        proPlanIsActive: subscription.status === 'active',
        proPlanIsTrial: subscription.trial_end ? true : false,
        proPlanStartedAt: new Date(subscription.start_date * 1000),
      },
    });

    // Store the session ID in the database
    await prisma.stripeSession.create({
      data: {
        id: session.id,
        userId: user.id,
        status: session.status || 'unknown',
        customerEmail: session.customer_email || undefined
      }
    });
  }

  // Handle subscription updates
  if (event.type === 'customer.subscription.updated') {
    const subscription = event.data.object as Stripe.Subscription;
    const customer = await stripe.customers.retrieve(subscription.customer as string);
    const customerEmail = (customer as Stripe.Customer).email;
    const plan = subscription.items.data[0].price;

    await prisma.user.update({
      where: {
        email: customerEmail || undefined,
      },
      data: {
        proExpiresAt: new Date(subscription.current_period_end * 1000),
        proStatus: subscription.status,
        proPlanIsActive: subscription.status === 'active',
        proPlanIsTrial: subscription.trial_end ? true : false,
      },
    });
  }

  // Handle subscription cancellations
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription;
    const customer = await stripe.customers.retrieve(subscription.customer as string);
    const customerEmail = (customer as Stripe.Customer).email;

    await prisma.user.update({
      where: {
        email: customerEmail || undefined,
      },
      data: {
        isPro: false,
        role: 'FREE', 
        proSubscriptionId: null,
        proExpiresAt: null,
        proType: null,
        proStatus: 'cancelled',
        proPlan: null,
        proPlanId: null,
        proPlanName: null,
        proPlanPrice: null,
        proPlanCurrency: null,
        proPlanInterval: null,
        proPlanTrialPeriodDays: null,
        proPlanIsActive: false,
        proPlanIsTrial: false,
        proPlanEndedAt: new Date(),
      },
    });
  }

  res.json({ received: true });
}
