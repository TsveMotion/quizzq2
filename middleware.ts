import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  console.log('\n--- Middleware Start ---');
  console.log('Path:', request.nextUrl.pathname);

  const session = await getToken({ req: request });
  console.log('Session present:', !!session);

  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                    request.nextUrl.pathname.startsWith('/signup');

  // Handle auth pages (login/signup)
  if (isAuthPage) {
    if (session) {
      console.log('User already logged in, redirecting to dashboard');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    console.log('Allowing access to auth page');
    return NextResponse.next();
  }

  // Handle protected routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      console.log('No session found, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Redirect /dashboard/superadmin to /dashboard
    if (request.nextUrl.pathname === '/dashboard/superadmin') {
      console.log('Redirecting superadmin to main dashboard');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    console.log('Access granted to dashboard');
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup']
}
