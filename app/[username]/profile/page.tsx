// app/[username]/profile/page.tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Bot, Zap, Calendar, Shield, Crown, Settings, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const { username } = useParams() as { username: string }
  const supabase = createClient()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [botCount, setBotCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
          .then(({ data }) => {
            setProfile(data)
          })

        supabase
          .from('bot_instances')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id)
          .then(({ count }) => {
            setBotCount(count || 0)
            setLoading(false)
          })
      }
    })
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-emerald-500/30 rounded-full blur-2xl" />
          <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full flex items-center justify-center text-4xl font-bold shadow-2xl border-4 border-gray-900">
            {username[0].toUpperCase()}
          </div>
        </div>
        <h1 className="text-2xl font-bold mt-4">@{username}</h1>
        <p className="text-gray-500 text-sm">{profile?.phone_number}</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Bot', value: botCount, icon: Bot, color: 'text-emerald-400' },
          { label: 'Active', value: 0, icon: Zap, color: 'text-blue-400' },
          { label: 'Joined', value: new Date(profile?.created_at).toLocaleDateString('id-ID'), icon: Calendar, color: 'text-amber-400', small: true },
        ].map(({ label, value, icon: Icon, color, small }) => (
          <div key={label} className="bg-gray-900/80 border border-gray-800/50 rounded-2xl p-4 text-center">
            <Icon size={20} className={`mx-auto mb-2 ${color}`} />
            <p className={`${small ? 'text-xs' : 'text-xl'} font-bold`}>{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
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
