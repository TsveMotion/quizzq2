import { cookies } from 'next/headers';
import * as jose from 'jose';
import { redirect } from 'next/navigation';

const JWT_SECRET = new TextEncoder().encode('your-super-secret-key-123');

export async function getAuthUser() {
  const token = cookies().get('token')?.value;
  
  if (!token) {
    redirect('/signin');
  }

  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    console.error('Token verification failed:', error);
    redirect('/signin');
  }
}
