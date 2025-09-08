import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const isPublicRoute = (pathname: string) => {
  const publicRoutes = [
    '/',
    '/homepage',
    '/test-page',
    '/auth/sign-in',
    '/auth/sign-up',
    '/auth/sign-out',
    '/onboarding',
    '/admin/login',
  ]
  return publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  ) || pathname.startsWith('/api/')
}

const isProtectedRoute = (pathname: string) => {
  return pathname.startsWith('/dashboard')
}

const isAdminRoute = (pathname: string) => {
  return pathname.startsWith('/admin')
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return response
  }

  // Handle admin routes separately
  if (isAdminRoute(pathname)) {
    // Admin routes don't require Supabase authentication - they use custom admin auth
    return response
  }

  // Redirect unauthenticated users to sign-in for dashboard routes
  if (!user && isProtectedRoute(pathname)) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url))
  }

  return response
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

