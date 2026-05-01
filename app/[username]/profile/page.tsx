// app/[username]/profile/page.tsx
'use client'

import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Bot, Zap, Crown, Settings, Shield, LogOut, Edit3, Save, X, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function ProfilePage() {
  const { username } = useParams() as { username: string }
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [bio, setBio] = useState('')
  const [saving, setSaving] = useState(false)
  const [botCount, setBotCount] = useState(0)
  const [activeBots, setActiveBots] = useState(0)

  useEffect(() => {
    fetchBotCount()
  }, [])

  const fetchBotCount = async () => {
    const res = await fetch('/api/bots/list')
    const data = await res.json()
    if (data.bots) {
      setBotCount(data.bots.length)
      setActiveBots(data.bots.filter((b: any) => b.status === 'connected').length)
    }
  }

  const signOut = async () => {
    document.cookie = 'auth_token=; path=/; max-age=0'
    router.push('/login')
  }

  const saveProfile = async () => {
    setSaving(true)
    await fetch('/api/auth/update-profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bio }),
    })
    setSaving(false)
    setEditing(false)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-emerald-500/30 rounded-full blur-2xl" />
          <div className="relative w-28 h-28 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full flex items-center justify-center text-5xl font-bold shadow-2xl border-4 border-gray-900">
            {username[0].toUpperCase()}
          </div>
        </div>
        <h1 className="text-2xl font-bold mt-4">@{username}</h1>
        <p className="text-gray-500 text-sm">Dashboard User</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Bot', value: botCount, icon: Bot, color: 'text-emerald-400' },
          { label: 'Active', value: activeBots, icon: Zap, color: 'text-blue-400' },
          { label: 'Free Plan', value: '', icon: Crown, color: 'text-amber-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-gray-900/80 border border-gray-800/50 rounded-2xl p-4 text-center">
            <Icon size={20} className={`mx-auto mb-2 ${color}`} />
            <p className="text-xl font-bold">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-900/80 border border-gray-800/50 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium">Bio</p>
          {!editing ? (
            <button onClick={() => setEditing(true)} className="text-gray-400 hover:text-emerald-400 transition">
              <Edit3 size={16} />
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={saveProfile} disabled={saving} className="text-emerald-400 hover:text-emerald-300 transition">
                {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
              </button>
              <button onClick={() => setEditing(false)} className="text-gray-400 hover:text-red-400 transition">
                <X size={16} />
              </button>
            </div>
          )}
        </div>
        {editing ? (
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tulis bio kamu..."
            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 resize-none"
            rows={3}
          />
        ) : (
          <p className="text-sm text-gray-400">{bio || 'Belum ada bio. Klik edit untuk menambahkan.'}</p>
        )}
      </div>

      <div className="bg-gray-900/80 border border-gray-800/50 rounded-2xl overflow-hidden">
        {[
          { icon: Settings, label: 'Settings', href: `/${username}/settings` },
          { icon: Shield, label: 'Keamanan', href: `/${username}/settings/password` },
          { icon: Crown, label: 'Upgrade Premium', href: '#', color: 'text-amber-400' },
        ].map(({ icon: Icon, label, href, color }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03] transition border-b border-gray-800/30 last:border-0"
          >
            <Icon size={20} className={color || 'text-gray-400'} />
            <span className="text-sm font-medium flex-1">{label}</span>
          </Link>
        ))}
      </div>

      <button
        onClick={signOut}
        className="w-full flex items-center justify-center gap-2 text-red-400 hover:bg-red-500/10 py-3 rounded-2xl transition text-sm font-medium"
      >
        <LogOut size={18} />
        Logout
      </button>
    </motion.div>
  )
}
