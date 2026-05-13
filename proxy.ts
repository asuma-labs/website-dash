// proxy.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isApiPath = pathname.startsWith('/api/')
  const isAuthPath = pathname.startsWith('/auth/')
  const isStaticFile = /\.(.*)$/.test(pathname)

  if (isApiPath || isAuthPath || isStaticFile) {
    return NextResponse.next()
  }

  const token = request.cookies.get('auth_token')?.value
  const isLoggedIn = !!token
  const isLoginPage = pathname === '/login'
  const isHomePage = pathname === '/'

  if (isLoggedIn && (isLoginPage || isHomePage)) {
    const supabaseAdmin = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll() {},
        },
      }
    )

    const { data: magicToken } = await supabaseAdmin
      .from('magic_tokens')
      .select('user_id')
      .eq('token', token)
      .eq('used', false)
      .single()

    if (magicToken) {
      // Token valid walau expired (grace period 30 hari)
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('username')
        .eq('id', magicToken.user_id)
        .single()

      if (profile) {
        const dashUrl = new URL(`/${profile.username}`, request.url)
        return NextResponse.redirect(dashUrl)
      }
    }
  }

  if (!isLoggedIn && !isLoginPage && !isHomePage) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icons/.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
/*/ proxy.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Daftar path public (nggak perlu login)
const publicPaths = [
  '/',
  '/login',
  '/faq',
  '/privacy',
  '/terms',
  '/og',
  '/jadibot',
  '/offline',
  '/explore',
  '/pricing',
  '/status',
  '/shop',
  '/auth',
  '/api',
]

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Cek apakah path termasuk public
  const isPublicPath = publicPaths.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  )
  const isStaticFile = /\.(.*)$/.test(pathname)

  if (isPublicPath || isStaticFile) {
    return NextResponse.next()
  }

  const token = request.cookies.get('auth_token')?.value
  const isLoggedIn = !!token
  const isLoginPage = pathname === '/login'

  if (isLoggedIn && isLoginPage) {
    const supabaseAdmin = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { cookies: { getAll() { return request.cookies.getAll() }, setAll() {} } }
    )

    const { data: magicToken } = await supabaseAdmin
      .from('magic_tokens')
      .select('user_id')
      .eq('token', token)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (magicToken) {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('username')
        .eq('id', magicToken.user_id)
        .single()

      if (profile) {
        return NextResponse.redirect(new URL(`/${profile.username}`, request.url))
      }
    }
  }

  if (!isLoggedIn && !isLoginPage && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icons/.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
// proxy.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isApiPath = pathname.startsWith('/api/')
  const isAuthPath = pathname.startsWith('/auth/')
  const isStaticFile = /\.(.*)$/.test(pathname)

  if (isApiPath || isAuthPath || isStaticFile) {
    return NextResponse.next()
  }

  const token = request.cookies.get('auth_token')?.value
  const isLoggedIn = !!token
  const isLoginPage = pathname === '/login'
  const isHomePage = pathname === '/'

  if (isLoggedIn && (isLoginPage || isHomePage)) {
    const supabaseAdmin = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll() {},
        },
      }
    )

    const { data: magicToken } = await supabaseAdmin
      .from('magic_tokens')
      .select('user_id')
      .eq('token', token)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (magicToken) {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('username')
        .eq('id', magicToken.user_id)
        .single()

      if (profile) {
        const dashUrl = new URL(`/${profile.username}`, request.url)
        return NextResponse.redirect(dashUrl)
      }
    }
  }

  if (!isLoggedIn && !isLoginPage && !isHomePage) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icons/.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
/* proxy.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isApiPath = pathname.startsWith('/api/')
  const isAuthPath = pathname.startsWith('/auth/')
  const isStaticFile = /\.(.*)$/.test(pathname)

  if (isApiPath || isAuthPath || isStaticFile) {
    return NextResponse.next()
  }

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

  const token = request.cookies.get('auth_token')?.value
  const isLoggedIn = !!token
  const isLoginPage = pathname === '/login'
  const isHomePage = pathname === '/'

  if (isLoggedIn && (isLoginPage || isHomePage)) {
    const supabaseAdmin = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll() {},
        },
      }
    )

    const { data: magicToken } = await supabaseAdmin
      .from('magic_tokens')
      .select('user_id')
      .eq('token', token)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (magicToken) {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('username')
        .eq('id', magicToken.user_id)
        .single()

      if (profile) {
        return NextResponse.redirect(new URL(`/${profile.username}`, request.url))
      }
    }
  }

  if (!isLoggedIn && !isLoginPage && !isHomePage) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icons/.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}*/
