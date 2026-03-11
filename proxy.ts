import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that don't require authentication
const publicRoutes = ['/login'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Exclude static files, API routes, and Next.js internal paths from proxy checks
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check if we're on a public route
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // In Next.js App Router, localStorage is not available on the server.
  // Ideally, tokens should be stored in cookies for SSR to work securely.
  // Since we are using localStorage currently, we must rely on a client-side check
  // or migrate to Cookies. We will implement Next.js Cookie checking for robust redirect.
  //
  // HOWEVER, because `setTokens` in `lib/auth.ts` uses localStorage, the proxy
  // won't see it. The quickest path for this immediate request without rewriting `lib/auth.ts`
  // is to implement a client-side redirect wrapper.

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};