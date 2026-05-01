// app/login/page.tsx
'use client'

import { Suspense, useState } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'

function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!turnstileToken) {
      setError('Mohon selesaikan verifikasi captcha')
      return
    }

    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        username: username.toLowerCase(), 
        password,
        turnstileToken 
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Login gagal')
      setLoading(false)
      return
    }

    window.location.href = `/${data.username}`
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="w-full max-w-md mx-4">
        <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl mb-4 shadow-lg shadow-emerald-500/20">
              <img src="/icons/android-chrome-192x192.png" alt="Asuma" className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Asuma MD
            </h1>
            <p className="text-gray-500 text-sm mt-2">Login ke Dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                required
              />
            </div>

            <div className="flex justify-center">
              <Turnstile
                siteKey="0x4AAAAAADBHnmS_9x1dKCBH"
                onSuccess={(token) => setTurnstileToken(token)}
                onError={() => setError('Verifikasi captcha gagal, coba lagi')}
                onExpire={() => setTurnstileToken(null)}
                options={{
                  theme: 'dark',
                  language: 'id',
                }}
              />
            </div>

            {error && (
              <div className="bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl p-4 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !turnstileToken}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-2xl transition-all hover:shadow-lg hover:shadow-emerald-500/25 active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Loading...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <p className="text-gray-600 text-sm text-center mt-6">
            Belum punya akun? Kirim{' '}
            <code className="text-emerald-400 bg-gray-800 px-2 py-1 rounded-lg">.daftar username|password</code>
            {' '}ke bot
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
