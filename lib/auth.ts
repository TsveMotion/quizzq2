import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface JWTPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export async function verifyAuth(token: string): Promise<JWTPayload> {
  try {
    console.log('Verifying token...');
    const verified = jwt.verify(token, JWT_SECRET) as JWTPayload;
    console.log('Token verified successfully:', verified);
    return verified;
  } catch (error) {
    console.error('Token verification failed:', error);
    throw new Error('Invalid token');
  }
}
