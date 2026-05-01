// app/[username]/settings/password/page.tsx
'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

export default function ChangePasswordPage() {
  const { username } = useParams() as { username: string }
  const router = useRouter()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (newPassword.length < 6) {
      setError('Password baru minimal 6 karakter')
      setLoading(false)
      return
    }

    const res = await fetch('/api/auth/edit-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Gagal mengganti password')
    } else {
      setSuccess('Password berhasil diganti!')
      setTimeout(() => router.push(`/${username}/settings`), 1500)
    }

    setLoading(false)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
      <Link href={`/${username}/settings`} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition">
        <ArrowLeft size={20} />
        <span className="text-sm">Kembali</span>
      </Link>

      <h1 className="text-2xl font-bold mb-2">Ganti Password</h1>
      <p className="text-gray-500 text-sm mb-8">Pastikan password baru kuat dan mudah diingat</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Password Lama</label>
          <div className="relative">
            <input
              type={showOld ? 'text' : 'password'}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="••••••"
              className="w-full bg-gray-900/80 border border-gray-700/50 rounded-2xl px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowOld(!showOld)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Password Baru</label>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="w-full bg-gray-900/80 border border-gray-700/50 rounded-2xl px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl p-3 text-sm">{error}</div>
        )}
        {success && (
          <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl p-3 text-sm">{success}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:opacity-50 text-white font-semibold py-3 rounded-2xl transition-all"
        >
          {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
        </button>
      </form>
    </motion.div>
  )
}
