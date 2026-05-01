// app/[username]/profile/page.tsx
'use client'

import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Bot, Zap, Crown, Settings, Shield, LogOut, Edit3, Save, X, RefreshCw, Camera, Check, Upload } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'

export default function ProfilePage() {
  const { username } = useParams() as { username: string }
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [editing, setEditing] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [botCount, setBotCount] = useState(0)
  const [activeBots, setActiveBots] = useState(0)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    fetchProfile()
    fetchBotCount()
  }, [])

  const fetchProfile = async () => {
    const res = await fetch('/api/auth/profile')
    const data = await res.json()
    if (data.profile) {
      setProfile(data.profile)
      setDisplayName(data.profile.display_name || '')
      setBio(data.profile.bio || '')
      setAvatarUrl(data.profile.avatar_url || '')
    }
  }

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
      body: JSON.stringify({ display_name: displayName, bio }),
    })
    setSaving(false)
    setEditing(false)
    fetchProfile()
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('avatar', file)

    const res = await fetch('/api/auth/upload-avatar', {
      method: 'POST',
      body: formData,
    })

    const data = await res.json()
    if (data.success) {
      setAvatarUrl(data.avatar_url)
      fetchProfile()
    }
    setUploading(false)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <div className="relative inline-block group">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={username}
              className="w-28 h-28 rounded-full object-cover border-4 border-gray-900 shadow-2xl"
            />
          ) : (
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/30 rounded-full blur-2xl" />
              <div className="relative w-28 h-28 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full flex items-center justify-center text-5xl font-bold shadow-2xl border-4 border-gray-900">
                {username[0].toUpperCase()}
              </div>
            </div>
          )}
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 w-9 h-9 bg-gray-900 border-2 border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-800 transition shadow-lg opacity-0 group-hover:opacity-100"
          >
            {uploading ? (
              <RefreshCw size={16} className="animate-spin text-emerald-400" />
            ) : (
              <Camera size={16} className="text-gray-300" />
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
        </div>

        {editing ? (
          <div className="mt-4 space-y-2">
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Display Name"
              className="block mx-auto bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-2 text-lg font-bold text-white text-center placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
            />
            <p className="text-gray-500 text-sm">@{username}</p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold mt-4">{displayName || `@${username}`}</h1>
            {displayName && <p className="text-gray-500 text-sm">@{username}</p>}
          </>
        )}
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
          <>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tulis bio kamu..."
              className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 resize-none mb-2"
              rows={3}
            />
            <p className="text-[10px] text-gray-600">Edit mode: Display Name dan Bio bisa diubah.</p>
          </>
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
