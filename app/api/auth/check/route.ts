import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAuthEdge } from '@/lib/auth';

export async function GET() {
  try {
    const token = cookies().get('token')?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false });
    }

    // Verify the token
    const user = await verifyAuthEdge(token);

    return NextResponse.json({ 
      authenticated: true,
      user: {
        id: user.userId,
        email: user.email,
        role: user.role,
        powerLevel: user.powerLevel
      }
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ authenticated: false });
  }
}
