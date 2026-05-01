// app/dashboard/nav.tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Home, Bot, Settings, LogOut, Zap, Sparkles, Activity } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function DashboardNav({ user, username }: { user: any; username: string }) {
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()
  const [hovered, setHovered] = useState<string | null>(null)

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const links = [
    { href: `/${username}`, label: 'Overview', icon: Home, color: 'from-blue-500 to-cyan-500' },
    { href: `/${username}/bots`, label: 'Bot Saya', icon: Bot, color: 'from-green-500 to-emerald-500' },
    { href: `/${username}/settings`, label: 'Settings', icon: Settings, color: 'from-purple-500 to-pink-500' },
  ]

  return (
    <aside className="w-72 fixed h-full bg-gray-900/80 backdrop-blur-xl border-r border-gray-800/50 p-6 flex flex-col shadow-2xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
            <Zap size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              Asuma MD
            </h1>
            <p className="text-xs text-gray-500">@{username}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {links.map(({ href, label, icon: Icon, color }) => (
          <Link
            key={href}
            href={href}
            onMouseEnter={() => setHovered(href)}
            onMouseLeave={() => setHovered(null)}
            className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group overflow-hidden ${
              pathname === href
                ? 'text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {pathname === href && (
              <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-10 rounded-xl`} />
            )}
            {hovered === href && !(pathname === href) && (
              <div className="absolute inset-0 bg-white/5 rounded-xl" />
            )}
            {pathname === href && (
              <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b ${color} rounded-r-full`} />
            )}
            <Icon size={20} className={pathname === href ? 'text-green-400' : ''} />
            <span className="font-medium">{label}</span>
            {pathname === href && (
              <Sparkles size={14} className="ml-auto text-green-400 animate-pulse" />
            )}
          </Link>
        ))}
      </nav>

      <div className="border-t border-gray-800/50 pt-4 mt-4">
        <div className="flex items-center gap-3 mb-4 p-3 bg-gray-800/50 rounded-xl">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center text-sm font-bold">
            {username[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">@{username}</p>
            <div className="flex items-center gap-1 text-xs text-green-400">
              <Activity size={10} />
              <span>Online</span>
            </div>
          </div>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-3 text-gray-400 hover:text-red-400 transition w-full px-4 py-2 rounded-lg hover:bg-red-500/10"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  )
}
