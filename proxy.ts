// proxy.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export default async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

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
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  const pathname = request.nextUrl.pathname

  if (pathname === '/login' && session) {
    const username = session.user.user_metadata?.username
    if (username) return NextResponse.redirect(new URL(`/${username}`, request.url))
  }

  if (pathname.startsWith('/auth/magic') || pathname.startsWith('/api/auth/register')) {
    return supabaseResponse
  }

  const dashboardPattern = /^\/([a-z0-9_-]+)(\/.*)?$/
  const match = pathname.match(dashboardPattern)

  if (match && match[1] !== 'api' && match[1] !== 'auth' && match[1] !== '_next' && match[1] !== 'favicon.ico') {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    const sessionUsername = session.user.user_metadata?.username
    if (sessionUsername !== match[1]) {
      return NextResponse.redirect(new URL(`/${sessionUsername}`, request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
