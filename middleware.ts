import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authCookie = request.cookies.get('magis_auth')?.value;
  const isAuthenticated = authCookie === 'true';

  // Allow static assets, images, API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Root URL / must ALWAYS open /login as requested
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Protect all internal pages - if unauthenticated and not on /login, redirect to /login
  if (!isAuthenticated && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
