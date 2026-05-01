// components/DashboardNav.tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Home, Bot, Settings, LogOut, Zap, Sparkles, Activity, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function DashboardNav({ username }: { username: string }) {
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

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
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 rounded-lg border border-gray-800"
      >
        <Menu size={24} className="text-white" />
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`
        fixed top-0 left-0 h-full z-50
        w-72 bg-gray-900/95 backdrop-blur-xl border-r border-gray-800/50 p-6 flex flex-col shadow-2xl
        transition-transform duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-1 hover:bg-gray-800 rounded-lg"
        >
          <X size={20} className="text-gray-400" />
        </button>

        <div className="mb-8">
          <Link href={`/${username}`} className="flex items-center gap-3 mb-2 hover:opacity-80 transition">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
              <Zap size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                Asuma MD
              </h1>
              <p className="text-xs text-gray-500">@{username}</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 space-y-1">
          {links.map(({ href, label, icon: Icon, color }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group overflow-hidden ${
                pathname === href ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {pathname === href && (
                <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-10 rounded-xl`} />
              )}
              {pathname === href && (
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b ${color} rounded-r-full`} />
              )}
              <Icon size={20} className={pathname === href ? 'text-green-400' : 'group-hover:text-white transition-colors'} />
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
    </>
  )
}
