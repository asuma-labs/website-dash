// app/api/auth/upload-avatar/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: Request) {
  const cookieStore = request.headers.get('cookie') || ''
  const token = cookieStore.match(/auth_token=([^;]+)/)?.[1]

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
    .gt('expires_at', new Date().toISOString())
    .single()

  if (!magicToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('avatar') as File

  if (!file) {
    return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const base64 = `data:${file.type};base64,${buffer.toString('base64')}`

  const uploadResult = await cloudinary.uploader.upload(base64, {
    folder: 'asuma-avatars',
    public_id: `${magicToken.user_id}`,
    overwrite: true,
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'face' },
      { quality: 'auto', fetch_format: 'auto' },
    ],
  })

  const { error } = await supabase
    .from('profiles')
    .update({ avatar_url: uploadResult.secure_url, updated_at: new Date().toISOString() })
    .eq('id', magicToken.user_id)

  if (error) {
    return NextResponse.json({ error: 'Gagal update profile' }, { status: 500 })
  }

  return NextResponse.json({ success: true, avatar_url: uploadResult.secure_url })
}
