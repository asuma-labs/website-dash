// app/login/page.tsx
'use client'

import { Suspense, useState } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import { motion } from 'framer-motion'
import { Lock, Phone, LogIn, Sparkles, ArrowLeft } from 'lucide-react'
import Cookies from 'js-cookie'
import { decodeJwt } from 'jose'

function LoginForm() {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!turnstileToken) {
      setError('Mohon selesaikan verifikasi captcha')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('https://bot.asuma.my.id/api/auth/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error === 'unregistered' ? 'Nomor WhatsApp belum terdaftar di bot Asuma' : 'Gagal mengirim OTP')
        setLoading(false)
        return
      }

      setStep('otp')
    } catch (err) {
      setError('Terjadi kesalahan jaringan server backend')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('https://bot.asuma.my.id/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error === 'invalid_otp' ? 'Kode OTP salah atau sudah kadaluarsa' : 'Verifikasi gagal')
        setLoading(false)
        return
      }

      Cookies.set('auth_token', data.token, { expires: 7, secure: true, sameSite: 'strict' })

      const payload = decodeJwt(data.token)
      const username = (payload.name as string) || 'dashboard'

      window.location.href = `/${username}`
    } catch (err) {
      setError('Gagal memproses verifikasi masuk')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-slate-950 to-gray-950 p-4">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 -left-20 w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 -right-20 w-[500px] h-[500px] bg-cyan-500/6 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-500/4 rounded-full blur-[180px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        className="w-full max-w-md relative"
      >
        <div className="relative bg-gray-950/70 backdrop-blur-3xl border border-white/[0.08] rounded-3xl p-8 shadow-2xl shadow-black/40 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {step === 'otp' && (
            <button
              onClick={() => { setStep('phone'); setError(''); setOtp(''); }}
              className="absolute top-6 left-6 text-gray-500 hover:text-white transition-colors flex items-center gap-1 text-sm"
            >
              <ArrowLeft size={16} /> Kembali
            </button>
          )}

          <div className="relative text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.1 }}
              className="relative inline-flex items-center justify-center mb-5"
            >
              <div className="absolute inset-0 bg-blue-500/30 rounded-2xl blur-xl animate-pulse" />
              <div className="relative w-16 h-16 bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/25 border border-white/15 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent" />
                <img src="/icons/android-chrome-192x192.png" alt="Asuma" className="w-10 h-10 relative z-10 drop-shadow-lg" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-gray-950 shadow-lg shadow-emerald-400/50 animate-pulse" />
            </motion.div>

            <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              Asuma MD
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              {step === 'phone' ? 'Login ke Dashboard via WhatsApp' : 'Masukkan Kode OTP'}
            </p>
          </div>

          <form onSubmit={step === 'phone' ? handleRequestOTP : handleVerifyOTP} className="relative space-y-4">
            {step === 'phone' ? (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Nomor WhatsApp</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="628xxxxxxxxx"
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    required
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Kode OTP Bot</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="••••••"
                    maxLength={6}
                    className="w-full tracking-[0.2em] font-mono text-center bg-white/[0.03] border border-white/[0.08] rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all text-lg"
                    required
                  />
                </div>
              </div>
            )}

            {step === 'phone' && (
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
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl p-4 text-sm"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || (step === 'phone' && !turnstileToken)}
              className="w-full relative bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-2xl transition-all hover:shadow-2xl hover:shadow-blue-500/25 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              {loading ? (
                <span className="relative flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memproses...
                </span>
              ) : (
                <span className="relative flex items-center justify-center gap-2">
                  <LogIn size={18} />
                  {step === 'phone' ? 'Kirim OTP' : 'Verifikasi & Masuk'}
                </span>
              )}
            </motion.button>
          </form>

          <div className="relative mt-6 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl text-center">
            <p className="text-gray-400 text-sm">
              <Sparkles size={14} className="inline text-blue-400 mr-1" />
              Belum punya akun? Ketik{' '}
              <code className="text-blue-400 bg-white/[0.05] px-2 py-1 rounded-lg text-xs font-mono">
                .register nama
              </code>
              {' '}di WhatsApp Bot Asuma.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="relative"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 p-[2px]">
            <div className="w-full h-full rounded-2xl bg-gray-950 flex items-center justify-center">
              <Sparkles size={24} className="text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div className="absolute -inset-2 bg-blue-500/20 rounded-3xl blur-xl animate-pulse" />
        </motion.div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}

/*
'use client'

import { Suspense, useState } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import { motion } from 'framer-motion'
import { Lock, User, LogIn, Sparkles } from 'lucide-react'

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-slate-950 to-gray-950 p-4">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 -left-20 w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 -right-20 w-[500px] h-[500px] bg-cyan-500/6 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-500/4 rounded-full blur-[180px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        className="w-full max-w-md relative"
      >
        <div className="relative bg-gray-950/70 backdrop-blur-3xl border border-white/[0.08] rounded-3xl p-8 shadow-2xl shadow-black/40 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.1 }}
              className="relative inline-flex items-center justify-center mb-5"
            >
              <div className="absolute inset-0 bg-blue-500/30 rounded-2xl blur-xl animate-pulse" />
              <div className="relative w-16 h-16 bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/25 border border-white/15 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent" />
                <img src="/icons/android-chrome-192x192.png" alt="Asuma" className="w-10 h-10 relative z-10 drop-shadow-lg" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-gray-950 shadow-lg shadow-emerald-400/50 animate-pulse" />
            </motion.div>

            <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              Asuma MD
            </h1>
            <p className="text-gray-500 text-sm mt-2">Login ke Dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="relative space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  required
                />
              </div>
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
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl p-4 text-sm"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || !turnstileToken}
              className="w-full relative bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-2xl transition-all hover:shadow-2xl hover:shadow-blue-500/25 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              {loading ? (
                <span className="relative flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Loading...
                </span>
              ) : (
                <span className="relative flex items-center justify-center gap-2">
                  <LogIn size={18} />
                  Login
                </span>
              )}
            </motion.button>
          </form>

          <div className="relative mt-6 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl text-center">
            <p className="text-gray-400 text-sm">
              <Sparkles size={14} className="inline text-blue-400 mr-1" />
              Belum punya akun? Kirim{' '}
              <code className="text-blue-400 bg-white/[0.05] px-2 py-1 rounded-lg text-xs font-mono">
                .daftar username|password
              </code>
              {' '}ke bot
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="relative"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 p-[2px]">
            <div className="w-full h-full rounded-2xl bg-gray-950 flex items-center justify-center">
              <Sparkles size={24} className="text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div className="absolute -inset-2 bg-blue-500/20 rounded-3xl blur-xl animate-pulse" />
        </motion.div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
*/
