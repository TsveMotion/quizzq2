import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-super-secret-key-123');

export async function middleware(request: NextRequest) {
  console.log('\n--- Middleware Start ---');
  console.log('Path:', request.nextUrl.pathname);
  
  const token = request.cookies.get('token')?.value;
  console.log('Token present:', !!token);
  
  if (token) {
    console.log('Token preview:', token.substring(0, 20) + '...');
  }

  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                    request.nextUrl.pathname.startsWith('/signup');

  // Handle auth pages (login/signup)
  if (isAuthPage) {
    if (token) {
      try {
        await jose.jwtVerify(token, JWT_SECRET);
        console.log('Valid token on auth page, redirecting to dashboard');
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } catch (error) {
        console.log('Invalid token on auth page:', error.message);
      }
    }
    console.log('Allowing access to auth page');
    return NextResponse.next();
  }

  // Handle protected routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      console.log('No token found, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const { payload } = await jose.jwtVerify(token, JWT_SECRET);
      console.log('Token verified for dashboard access:', payload);
      return NextResponse.next();
    } catch (error) {
      console.log('Token verification failed:', error.message);
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }
  }

  console.log('--- Middleware End ---\n');
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup']
}
