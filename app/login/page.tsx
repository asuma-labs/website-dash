// app/login/page.tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.user_metadata?.username) {
        const redirect = searchParams.get('redirect')
        router.push(redirect || `/${session.user.user_metadata.username}`)
      }
    })
  }, [])

  const handleRequestMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '')

    const res = await fetch('/api/auth/request-magic-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number: cleanPhone }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Gagal mengirim link')
      setLoading(false)
      return
    }

    setError('')
    alert(`Link login telah dikirim ke WhatsApp kamu!\n\n${data.magic_link}`)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full p-8 bg-gray-800 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-white text-center mb-2">Asuma MD</h1>
        <p className="text-gray-400 text-center mb-8">Login Dashboard</p>

        <form onSubmit={handleRequestMagicLink}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Nomor WhatsApp</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="6281234567890"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg p-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition"
          >
            {loading ? 'Mengirim...' : 'Kirim Link Login'}
          </button>
        </form>

        <p className="text-gray-500 text-sm text-center mt-6">
          Belum punya akun? Kirim <code className="text-green-400">.daftar username password</code> ke bot
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
