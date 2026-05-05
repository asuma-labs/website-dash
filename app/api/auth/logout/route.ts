// app/api/auth/logout/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { parse } from 'cookie'

export async function POST(request: Request) {
  try {
    const cookieStore = request.headers.get('cookie') || ''
    const cookies = parse(cookieStore)
    const token = cookies.auth_token

    if (!token) {
      return NextResponse.json({ success: true, message: 'Already logged out' })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )
    const { data: magicToken } = await supabase
      .from('magic_tokens')
      .select('user_id')
      .eq('token', token)
      .eq('used', false)
      .single()

    if (!magicToken) {
      const response = NextResponse.json({ success: true, message: 'Token already expired' })
      clearAllCookies(response)
      return response
    }
    await supabase.from('magic_tokens').delete().eq('token', token)
    await supabase.from('push_subscriptions').delete().eq('user_id', magicToken.user_id)

    const response = NextResponse.json({ success: true, message: 'Logged out successfully' })
    clearAllCookies(response)
    return response

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ success: false, message: 'Failed to logout' }, { status: 500 })
  }
}

function clearAllCookies(response: NextResponse) {
  const cookieNames = [
    'auth_token',
    'sb-access-token',
    'sb-refresh-token',
    'sb-provider-token',
  ]

  const domain = process.env.COOKIE_DOMAIN || '.asuma.my.id'

  cookieNames.forEach(name => {
    response.cookies.set(name, '', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      domain,
      maxAge: 0,
    })
  })
}
