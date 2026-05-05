// app/[username]/profile/page.tsx
'use client'

import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Bot, Zap, Crown, Settings, Shield, LogOut, Edit3, Save, X,
  RefreshCw, Camera, Upload, User, CheckCircle, Copy, ArrowRight,
} from 'lucide-react'
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

  const [editingUsername, setEditingUsername] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [usernameSuccess, setUsernameSuccess] = useState('')

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
    await fetch('/api/auth/logout', { method: 'POST' })
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

  const saveUsername = async () => {
    setUsernameError('')
    setUsernameSuccess('')

    const res = await fetch('/api/auth/update-username', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newUsername }),
    })

    const data = await res.json()

    if (!res.ok) {
      setUsernameError(data.error)
    } else {
      setUsernameSuccess('Username berhasil diubah!')
      setEditingUsername(false)
      setTimeout(() => {
        window.location.href = `/${data.username}/profile`
      }, 1500)
    }
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto space-y-6"
    >
      <div className="text-center">
        <div className="relative inline-block">
          {avatarUrl ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl" />
              <img
                src={avatarUrl}
                alt={username}
                className="relative w-28 h-28 rounded-full object-cover border-4 border-gray-900 shadow-2xl"
              />
            </motion.div>
          ) : (
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-2xl" />
              <div className="relative w-28 h-28 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-5xl font-bold shadow-2xl border-4 border-gray-900">
                {username[0].toUpperCase()}
              </div>
            </div>
          )}

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute -bottom-1 -right-1 w-10 h-10 bg-blue-500 hover:bg-blue-600 border-2 border-gray-900 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-95"
          >
            {uploading ? (
              <RefreshCw size={18} className="animate-spin text-white" />
            ) : (
              <Camera size={18} className="text-white" />
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
              className="block mx-auto bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2 text-lg font-bold text-white text-center placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
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
          { label: 'Total Bot', value: botCount, icon: Bot, color: 'text-cyan-400' },
          { label: 'Active', value: activeBots, icon: Zap, color: 'text-blue-400' },
          { label: 'Free Plan', value: '', icon: Crown, color: 'text-amber-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <motion.div
            key={label}
            whileHover={{ y: -2 }}
            className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 text-center hover:border-blue-500/20 transition-all"
          >
            <Icon size={20} className={`mx-auto mb-2 ${color}`} />
            <p className="text-xl font-bold">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium">Username</p>
          {!editingUsername ? (
            <button
              onClick={() => setEditingUsername(true)}
              className="text-gray-400 hover:text-cyan-400 transition"
            >
              <Edit3 size={16} />
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={saveUsername} className="text-cyan-400 hover:text-cyan-300 transition">
                <Save size={16} />
              </button>
              <button
                onClick={() => setEditingUsername(false)}
                className="text-gray-400 hover:text-red-400 transition"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>
        {editingUsername ? (
          <div>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder={username}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
            />
            {usernameError && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <X size={12} />
                {usernameError}
              </p>
            )}
            {usernameSuccess && (
              <p className="text-cyan-400 text-xs mt-1 flex items-center gap-1">
                <CheckCircle size={12} />
                {usernameSuccess}
              </p>
            )}
            <p className="text-[10px] text-gray-600 mt-1">Max 1x ganti per bulan</p>
          </div>
        ) : (
          <p className="text-sm text-gray-400">@{username}</p>
        )}
      </div>

      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium">Bio</p>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="text-gray-400 hover:text-cyan-400 transition"
            >
              <Edit3 size={16} />
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={saveProfile}
                disabled={saving}
                className="text-cyan-400 hover:text-cyan-300 transition"
              >
                {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="text-gray-400 hover:text-red-400 transition"
              >
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
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 resize-none mb-2"
              rows={3}
            />
            <p className="text-[10px] text-gray-600">Edit mode: Display Name dan Bio bisa diubah.</p>
          </>
        ) : (
          <p className="text-sm text-gray-400">
            {bio || 'Belum ada bio. Klik edit untuk menambahkan.'}
          </p>
        )}
      </div>

      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
        {[
          { icon: Settings, label: 'Settings', href: `/${username}/settings` },
          { icon: Shield, label: 'Keamanan', href: `/${username}/settings/password` },
          { icon: Crown, label: 'Upgrade Premium', href: '#', color: 'text-amber-400' },
        ].map(({ icon: Icon, label, href, color }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.04] transition border-b border-white/[0.04] last:border-0 group"
          >
            <Icon size={20} className={color || 'text-gray-400 group-hover:text-cyan-400 transition-colors'} />
            <span className="text-sm font-medium flex-1">{label}</span>
            <ArrowRight size={14} className="text-gray-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>

      <button
        onClick={signOut}
        className="w-full flex items-center justify-center gap-2 text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 py-3 rounded-2xl transition text-sm font-medium"
      >
        <LogOut size={18} />
        Logout
      </button>

      <p className="text-center text-xs text-gray-600 pb-8">
        Asuma MD v2.0
      </p>
    </motion.div>
  )
}
