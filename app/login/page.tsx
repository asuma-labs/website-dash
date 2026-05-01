// app/login/page.tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

function LoginForm() {
  const supabase = createClient()
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [debug, setDebug] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.user_metadata?.username) {
        router.push(`/${session.user.user_metadata.username}`)
      }
    })
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setDebug('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.toLowerCase(), password }),
      })

      const data = await res.json()
      setDebug(JSON.stringify(data, null, 2))

      if (!res.ok) {
        setError(data.error || 'Login gagal')
        setLoading(false)
        return
      }

      if (!data.access_token) {
        setError('Token tidak ditemukan di response')
        setLoading(false)
        return
      }

      const { error: sessionError } = await supabase.auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      })

      if (sessionError) {
        setError('Session error: ' + sessionError.message)
        setLoading(false)
        return
      }

      setDebug('Session set! Redirecting to /' + data.username + '...')
      
      setTimeout(() => {
        window.location.href = `/${data.username}`
      }, 500)

    } catch (err: any) {
      setError('Network error: ' + err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full p-8 bg-gray-800 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-white text-center mb-2">Asuma MD</h1>
        <p className="text-gray-400 text-center mb-8">Login Dashboard</p>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg p-3 mb-4 text-sm">
              {error}
            </div>
          )}

          {debug && (
            <div className="bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg p-3 mb-4 text-xs overflow-auto max-h-40">
              <pre>{debug}</pre>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition"
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
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
