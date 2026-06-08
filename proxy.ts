import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

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

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_super_aman_asuma_bot';

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const isPublicPath = publicPaths.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  )
  const isStaticFile = /\.(.*)$/.test(pathname)

  if (isPublicPath && pathname !== '/login' || isStaticFile) {
    return NextResponse.next()
  }

  const token = request.cookies.get('auth_token')?.value
  const isLoginPage = pathname === '/login'

  if (token) {
    try {
      const secret = new TextEncoder().encode(JWT_SECRET)
      const { payload } = await jwtVerify(token, secret)
      const username = payload.name || 'dashboard'

      if (isLoginPage) {
        return NextResponse.redirect(new URL(`/${username}`, request.url))
      }

      return NextResponse.next()
    } catch (error) {
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('auth_token')
      return response
    }
  }

  if (!token && !isLoginPage && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icons/.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}

/*/ proxy.ts 
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

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
*/
