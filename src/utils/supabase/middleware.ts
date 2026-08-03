import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const adminSession = request.cookies.get('admin_session')?.value
  const isAuthenticatedAdmin = !!user || !!adminSession
  const url = request.nextUrl.clone()

  // Redirect logged-in admin away from /admin/login to /admin
  if (request.nextUrl.pathname === '/admin/login' && isAuthenticatedAdmin) {
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    if (!isAuthenticatedAdmin) {
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
  }

  // Note: /perusahaan and /perusahaan/[id] are public routes.
  // Company dashboard is at /dashboard.
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!user) {
      url.pathname = '/perusahaan/login'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
