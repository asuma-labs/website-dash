// app/[username]/settings/page.tsx
'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Bell, Shield, User, Palette, Smartphone, Globe,
  Trash2, LogOut, ChevronRight, CheckCircle, Copy, Loader2,
  type LucideIcon
} from 'lucide-react'
import PushNotificationToggle from '@/components/PushNotificationToggle'
import Image from 'next/image'

type SettingItem = {
  label: string
  value: string
  icon: LucideIcon
  iconClass: string
  action?: () => void
  badge?: boolean
}

type SettingSection = {
  title: string
  icon: LucideIcon
  iconColor: string
  items?: SettingItem[]
  component?: React.ReactNode
}

export default function SettingsPage() {
  const { username } = useParams() as { username: string }
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  const copyUsername = () => {
    navigator.clipboard.writeText(username)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const settingsSections: SettingSection[] = [
    {
      title: 'Akun',
      icon: User,
      iconColor: 'text-blue-400',
      items: [
        {
          label: 'Username',
          value: `@${username}`,
          action: copyUsername,
          icon: copied ? CheckCircle : Copy,
          iconClass: copied ? 'text-cyan-400' : 'text-gray-500',
        },
        {
          label: 'Role',
          value: 'Premium',
          icon: Shield,
          iconClass: 'text-amber-400',
          badge: true,
        },
      ],
    },
    {
      title: 'Notifikasi',
      icon: Bell,
      iconColor: 'text-cyan-400',
      component: <PushNotificationToggle />,
    },
    {
      title: 'Preferensi',
      icon: Palette,
      iconColor: 'text-sky-400',
      items: [
        {
          label: 'Tema',
          value: 'Dark',
          icon: Palette,
          iconClass: 'text-gray-500',
        },
        {
          label: 'Bahasa',
          value: 'Indonesia',
          icon: Globe,
          iconClass: 'text-gray-500',
        },
      ],
    },
    {
      title: 'Perangkat',
      icon: Smartphone,
      iconColor: 'text-teal-400',
      items: [
        {
          label: 'Session',
          value: 'Aktif',
          icon: Smartphone,
          iconClass: 'text-emerald-400',
        },
      ],
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-500 mt-2">Kelola akun dan preferensi bot Anda</p>
      </div>

      <div className="relative bg-gray-900/80 backdrop-blur-xl border border-white/[0.06] rounded-3xl p-6 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/30 rounded-2xl blur-lg" />
            <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 border border-white/10 overflow-hidden">
              <Image
                src="/icons/android-chrome-192x192.png"
                alt="Profile"
                width={64}
                height={64}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-gray-950 shadow-lg shadow-emerald-400/50 animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold">@{username}</h2>
            <p className="text-sm text-gray-400">Premium Member</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Shield size={18} className="text-white" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {settingsSections.map((section, idx) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * idx }}
            className="relative bg-gray-900/80 backdrop-blur-xl border border-white/[0.06] rounded-3xl p-6 overflow-hidden"
          >
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-500/3 rounded-full blur-2xl pointer-events-none" />
            <div className="relative space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                  <section.icon size={18} className={section.iconColor} />
                </div>
                <h3 className="font-semibold">{section.title}</h3>
              </div>
              {section.component && (
                <div className="pl-12">{section.component}</div>
              )}
              {section.items && (
                <div className="pl-12 space-y-2">
                  {section.items.map((item) => (
                    <div
                      key={item.label}
                      className={`flex items-center justify-between py-2 ${item.action ? 'cursor-pointer hover:opacity-80' : ''}`}
                      onClick={item.action}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon size={15} className={item.iconClass} />
                        <span className="text-sm text-gray-400">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{item.value}</span>
                        {item.badge && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-400 text-[10px] font-medium border border-amber-500/20">
                            PRO
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="relative bg-red-500/5 border border-red-500/15 rounded-3xl p-6 overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <Trash2 size={18} className="text-red-400" />
            </div>
            <h3 className="font-semibold text-red-400">Danger Zone</h3>
          </div>
          <div className="pl-12 space-y-2">
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-all disabled:opacity-50 group"
            >
              <span className="flex items-center gap-3 text-sm font-medium">
                {loggingOut ? <Loader2 size={15} className="animate-spin" /> : <LogOut size={15} />}
                {loggingOut ? 'Logging out...' : 'Logout'}
              </span>
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
            </button>
            <p className="text-[10px] text-red-400/50 px-4">
              Anda akan keluar dari semua sesi dan perlu login ulang untuk mengakses dashboard.
            </p>
          </div>
        </div>
      </motion.div>

      <p className="text-center text-xs text-gray-600 pb-8">
        Asuma MD v2.0 — Powered by Asuma Bot
      </p>
    </motion.div>
  )
}
