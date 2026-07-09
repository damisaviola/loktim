import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET_KEY = process.env.JWT_SECRET || 'super-secret-key-for-local-dev-change-in-prod';
const key = new TextEncoder().encode(JWT_SECRET_KEY);

export async function proxy(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isLoginRoute = request.nextUrl.pathname === '/login';

  // We only want to protect /admin routes and handle /login
  if (!isAdminRoute && !isLoginRoute) {
    return NextResponse.next();
  }

  // Check the JWT token in cookies
  const token = request.cookies.get('admin_session')?.value;
  let isValidSession = false;

  if (token) {
    try {
      // Verify the JWT token on the Edge runtime
      await jwtVerify(token, key);
      isValidSession = true;
    } catch (err) {
      isValidSession = false;
    }
  }

  // If accessing protected admin route without session, go to login
  if (isAdminRoute && !isValidSession) {
    const loginUrl = new URL('/login', request.url);
    const response = NextResponse.redirect(loginUrl);
    if (token) {
      // Clear invalid token
      response.cookies.delete('admin_session');
    }
    return response;
  }

  // If user is logged in and trying to access /login, redirect to /admin
  if (isLoginRoute && isValidSession) {
    const adminUrl = new URL('/admin', request.url);
    return NextResponse.redirect(adminUrl);
  }

  // If accessing admin routes with a valid session, inject security headers
  if (isAdminRoute && isValidSession) {
    const response = NextResponse.next();
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    return response;
  }

  return NextResponse.next();
}

// Configure which routes use the middleware
export const config = {
  matcher: ['/admin/:path*', '/login'],
};
