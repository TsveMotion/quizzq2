import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

// Pages that don't require authentication
const publicPages = new Set([
  '/about',
  '/contact',
  '/',
  '/auth/signin',
  '/auth/signup',
  '/auth/error',
  '/maintenance'
]);

// Pages that are always accessible even in maintenance mode
const maintenanceAllowedPages = new Set([
  '/auth/signin',
  '/auth/signup',
  '/auth/error',
  '/maintenance',
  '/api/auth/signin',
  '/api/auth/signout',
  '/api/auth/session',
  '/api/auth/csrf',
  '/_next',
  '/static',
  '/favicon.ico'
]);

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Check maintenance mode first
    const maintenanceMode = req.cookies.get('maintenance_mode')?.value === 'true';
    const maintenanceMessage = req.cookies.get('maintenance_message')?.value;

    // If in maintenance mode and user is not a superadmin
    if (maintenanceMode && (!token || token.role !== 'SUPERADMIN')) {
      // Check if the path is allowed during maintenance
      const isMaintenanceAllowed = maintenanceAllowedPages.has(pathname) ||
        pathname.startsWith('/api/auth/') ||
        pathname.startsWith('/_next/') ||
        pathname.startsWith('/static/');

      if (!isMaintenanceAllowed) {
        // Redirect to maintenance page with message
        const url = new URL('/maintenance', req.url);
        if (maintenanceMessage) {
          url.searchParams.set('message', maintenanceMessage);
        }
        return NextResponse.redirect(url);
      }
    }

    // Handle public pages after maintenance check
    if (publicPages.has(pathname) || 
        pathname.startsWith('/api/auth/') || 
        pathname.startsWith('/_next/') ||
        pathname.startsWith('/static/')) {
      return NextResponse.next();
    }

    // Handle dashboard access
    if (pathname.startsWith('/dashboard')) {
      // Not authenticated
      if (!token) {
        return NextResponse.redirect(new URL('/signin', req.url));
      }

      // All users go to /dashboard/user except special roles
      const userRole = token.role?.toLowerCase();
      if (userRole === 'superadmin' || userRole === 'schooladmin' || userRole === 'teacher') {
        const correctPath = `/dashboard/${userRole}`;
        if (!pathname.startsWith(correctPath)) {
          return NextResponse.redirect(new URL(correctPath, req.url));
        }
      } else {
        // All other users (including 'free' and 'pro') go to /dashboard/user
        if (!pathname.startsWith('/dashboard/user')) {
          return NextResponse.redirect(new URL('/dashboard/user', req.url));
        }
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req }) => {
        const pathname = req.nextUrl.pathname;
        
        // Always allow public pages and auth endpoints
        if (publicPages.has(pathname) || 
            pathname.startsWith('/api/auth/') || 
            pathname.startsWith('/_next/') ||
            pathname.startsWith('/static/')) {
          return true;
        }

        return true;
      },
    },
  }
);

// Match all routes except static files
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
