// app/api/auth/check/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { phone_number, username } = await request.json()

  if (!phone_number && !username) {
    return NextResponse.json({ error: 'Nomor atau username diperlukan' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  let query = supabase.from('profiles').select('username, phone_number')

  if (phone_number) {
    query = query.eq('phone_number', phone_number)
  }
  if (username) {
    query = query.eq('username', username)
  }

  const { data: profile, error } = await query.single()

  if (error || !profile) {
    return NextResponse.json({ error: 'Akun tidak ditemukan' }, { status: 404 })
  }

  return NextResponse.json({
    success: true,
    username: profile.username,
    phone_number: profile.phone_number,
  })
}
