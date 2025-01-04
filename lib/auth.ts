import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-123';

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  powerLevel: number;
  iat?: number;
  exp?: number;
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

export function createToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch {
    return null;
  }
}
