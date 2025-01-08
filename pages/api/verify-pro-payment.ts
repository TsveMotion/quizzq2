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
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { sessionId } = req.body;

  try {
    // Check if this Stripe session exists and is completed
    const stripeSession = await prisma.stripeSession.findUnique({
      where: {
        id: sessionId
      }
    });

    if (!stripeSession) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (stripeSession.customerEmail !== session.user?.email) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error('Error verifying pro payment:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}
