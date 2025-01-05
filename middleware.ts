import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // If user is not authenticated and tries to access protected routes
    if (!token && pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/signin', req.url));
    }

    // If authenticated user tries to access wrong dashboard
    if (token && pathname.startsWith('/dashboard')) {
      const role = token.role?.toUpperCase();
      const correctPath = getCorrectDashboardPath(role);
      
      // If user is trying to access the wrong dashboard, redirect them
      if (!pathname.startsWith(correctPath)) {
        return NextResponse.redirect(new URL(correctPath, req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

function getCorrectDashboardPath(role?: string): string {
  switch (role) {
    case 'SUPERADMIN':
      return '/dashboard/superadmin';
    case 'SCHOOLADMIN':
      return '/dashboard/schooladmin';
    case 'TEACHER':
      return '/dashboard/teacher';
    case 'STUDENT':
      return '/dashboard/student';
    default:
      return '/signin';
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
  ]
};
