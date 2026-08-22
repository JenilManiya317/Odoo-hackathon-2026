import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ?? process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) return response

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    { cookies: { getAll: () => request.cookies.getAll(), setAll: (cookiesToSet) => { cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value)); response = NextResponse.next({ request }); cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options)) } } },
  )
  const { data: { user } } = await supabase.auth.getUser()
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth')
  const protectedPath = request.nextUrl.pathname === '/'
    || ['/profile', '/calendar', '/trips', '/activities', '/recommendations', '/admin'].some((path) => request.nextUrl.pathname.startsWith(path))

  if (protectedPath && !user) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  return response
}
