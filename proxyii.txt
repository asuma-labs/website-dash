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
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
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

  const publicPaths = ['/login', '/', '/auth/magic']
  const isPublicPath = publicPaths.some(p => pathname === p || pathname.startsWith(p))
  const isApiPath = pathname.startsWith('/api/')
  const isStaticPath = pathname.startsWith('/_next') || pathname.startsWith('/favicon.ico')

  if (isApiPath || isStaticPath) {
    return supabaseResponse
  }

  if (pathname === '/login' && session) {
    const username = session.user.user_metadata?.username
    if (username && pathname !== `/${username}`) {
      return NextResponse.redirect(new URL(`/${username}`, request.url))
    }
    return supabaseResponse
  }

  const dashboardPattern = /^\/([a-z0-9_-]+)(\/.*)?$/
  const match = pathname.match(dashboardPattern)

  if (match) {
    const username = match[1]
    if (username === 'api' || username === 'auth' || username === '_next' || username === 'favicon.ico') {
      return supabaseResponse
    }
    
    if (!session) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    const sessionUsername = session.user.user_metadata?.username
    if (sessionUsername && sessionUsername !== username) {
      return NextResponse.redirect(new URL(`/${sessionUsername}`, request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
