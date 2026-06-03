// middleware.ts
// Route protection middleware - restricts access to authenticated users only
// Public routes: / (landing page), /api/auth (auth endpoints)
// Protected routes: /dashboard, /add-monitor, /monitors, /api/monitors, /api/pings

import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow public routes (landing page, auth endpoints, and external cron check triggers)
        const publicPaths = ['/', '/api/auth', '/api/health/db', '/api/cron'];
        if (publicPaths.some(path => pathname === path || pathname.startsWith(path))) {
          return true;
        }
        
        // Protect all other routes (dashboard, monitors, pings, add-monitor)
        return !!token;
      },
    },
    pages: {
      signIn: '/',
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files asset extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};