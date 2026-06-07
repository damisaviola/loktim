import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET_KEY = process.env.JWT_SECRET || 'super-secret-key-for-local-dev-change-in-prod'
const key = new TextEncoder().encode(JWT_SECRET_KEY)

export async function proxy(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isLoginRoute = request.nextUrl.pathname === '/login'

  const token = request.cookies.get('admin_session')?.value
  let isValidSession = false

  if (token) {
    try {
      await jwtVerify(token, key)
      isValidSession = true
    } catch (err) {
      isValidSession = false
    }
  }

  // If accessing protected admin route without session, go to login
  if (isAdminRoute && !isValidSession) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If user is logged in and trying to access /login, redirect to /admin
  if (isLoginRoute && isValidSession) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
