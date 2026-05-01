// app/auth/magic/page.tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

function MagicContent() {
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading')
  const [message, setMessage] = useState('Memverifikasi token...')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Token tidak ditemukan')
      return
    }

    const verifyToken = async () => {
      const res = await fetch('/api/auth/magic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })

      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setMessage(data.error || 'Token tidak valid')
        return
      }

      setStatus('success')
      setMessage('Login berhasil! Mengalihkan...')

      await supabase.auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      })

      setTimeout(() => {
        router.push(`/${data.username}`)
      }, 1000)
    }

    verifyToken()
  }, [token])

  return (
    <div className="text-center">
      {status === 'loading' && (
        <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4" />
      )}
      {status === 'error' && <p className="text-red-400 text-6xl mb-4">✗</p>}
      {status === 'success' && <p className="text-green-400 text-6xl mb-4">✓</p>}
      <p className="text-white text-lg">{message}</p>
    </div>
  )
}

export default function MagicPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <Suspense fallback={
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-white text-lg">Loading...</p>
        </div>
      }>
        <MagicContent />
      </Suspense>
    </div>
  )
}
