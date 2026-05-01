// app/api/auth/edit-password/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  const { phone_number, new_password } = await request.json()

  if (!phone_number || !new_password) {
    return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
  }

  if (new_password.length < 6) {
    return NextResponse.json({ error: 'Password minimal 6 karakter' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, username')
    .eq('phone_number', phone_number)
    .single()

  if (!profile) {
    return NextResponse.json({ error: 'Akun tidak ditemukan' }, { status: 404 })
  }

  const password_hash = await bcrypt.hash(new_password, 10)

  const { error } = await supabase
    .from('profiles')
    .update({ password_hash, updated_at: new Date().toISOString() })
    .eq('id', profile.id)

  if (error) {
    return NextResponse.json({ error: 'Gagal mengupdate password' }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    username: profile.username,
  })
}
