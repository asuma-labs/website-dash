// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const cookieStore = request.headers.get('cookie') || ''
  const token = cookieStore.match(/auth_token=([^;]+)/)?.[1]

  if (!token) {
    return NextResponse.json({ success: true })
  }

  const response = NextResponse.json({ success: true })

  response.cookies.set('auth_token', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    domain: '.asuma.my.id', // ← SAMA
    maxAge: 0,
  })

  return response
}
