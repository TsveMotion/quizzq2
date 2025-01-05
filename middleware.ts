import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const role = token?.role;
    const pathname = req.nextUrl.pathname;

    // Redirect from /dashboard/[role] to /dashboard for all users
    if (pathname.startsWith('/dashboard/')) {
      const url = new URL('/dashboard', req.url);
      return NextResponse.redirect(url);
    }

    // Handle /dashboard route based on user role
    if (pathname === '/dashboard') {
      if (!role) {
        const url = new URL('/auth/signin', req.url);
        return NextResponse.redirect(url);
      }

      // Allow access to dashboard for all authenticated users
      return NextResponse.next();
    }

    // Protect API routes
    if (pathname.startsWith('/api/')) {
      if (!role) {
        return new NextResponse('Unauthorized', { status: 401 });
      }

      // Handle school-specific routes
      if (pathname.startsWith('/api/schools/')) {
        const urlParts = pathname.split('/');
        const requestedSchoolId = urlParts[3]; // /api/schools/[schoolId]/...

        // Allow superadmins to access all schools
        if (role === 'superadmin') {
          return NextResponse.next();
        }

        // For school admins and other roles, verify school access
        if (token.schoolId && token.schoolId === requestedSchoolId) {
          return NextResponse.next();
        }

        console.error('Unauthorized school access:', {
          role,
          userSchoolId: token.schoolId,
          requestedSchoolId,
          pathname
        });
        return new NextResponse('Unauthorized access to school data', { status: 403 });
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

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};
