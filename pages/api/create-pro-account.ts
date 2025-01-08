import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';
import { getSession } from 'next-auth/react';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getSession({ req });
  if (!session?.user?.email) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Verify the user has a valid Stripe payment
  const stripeSession = await prisma.stripeSession.findFirst({
    where: {
      email: session.user.email,
      status: 'completed',
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!stripeSession) {
    return res.status(403).json({ message: 'Payment required' });
  }

  // Update user profile with PRO data
  const { bio, subjects, education, experience } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        bio,
        subjects,
        education,
        experience,
        isPro: true,
      },
    });

    return res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error updating PRO account:', error);
    return res.status(500).json({ message: 'Error updating PRO account' });
  }
}
