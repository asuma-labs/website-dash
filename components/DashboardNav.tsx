// components/DashboardNav.tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Home, Bot, Settings, LogOut, Zap, Sparkles, Activity, Menu, X, Command, Gift, Layers } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
    { href: `/${username}`, label: 'Overview', icon: Home, color: 'from-emerald-400 to-cyan-400', glow: 'shadow-emerald-500/20' },
    { href: `/${username}/bots`, label: 'Bot Saya', icon: Bot, color: 'from-violet-400 to-purple-400', glow: 'shadow-violet-500/20' },
    { href: `/${username}/settings`, label: 'Settings', icon: Settings, color: 'from-amber-400 to-orange-400', glow: 'shadow-amber-500/20' },
  ]

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-800 shadow-lg"
      >
        <Menu size={24} className="text-white" />
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside className={`
        fixed top-0 left-0 h-full z-40
        w-72 bg-gray-950/90 backdrop-blur-2xl border-r border-gray-800/50 p-6 flex flex-col
        transition-transform duration-500 ease-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 hover:bg-gray-800 rounded-xl transition"
        >
          <X size={20} className="text-gray-400" />
        </button>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href={`/${username}`} className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-green-500/30">
                <img src="/icons/android-chrome-192x192.png" alt="Asuma" className="w-8 h-8" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Asuma MD
              </h1>
              <p className="text-xs text-gray-500 font-medium">@{username}</p>
            </div>
          </Link>
        </motion.div>

        <nav className="flex-1 space-y-1.5">
          {links.map(({ href, label, icon: Icon, color, glow }, i) => (
            <motion.div
              key={href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <Link
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                  pathname === href
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {pathname === href && (
                  <>
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute inset-0 bg-gradient-to-r ${color} opacity-10 rounded-2xl border border-white/5`}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                    <div className={`absolute left-2 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b ${color} rounded-full`} />
                  </>
                )}
                <Icon size={20} className={`${pathname === href ? '' : 'group-hover:text-white'} transition-colors`} />
                <span className="font-medium">{label}</span>
                {pathname === href && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Sparkles size={14} className="ml-auto text-emerald-400" />
                  </motion.div>
                )}
              </Link>
            </motion.div>
          ))}
        </nav>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-gray-800/50 pt-4 mt-4 space-y-3"
        >
          <div className="flex items-center gap-3 px-3 py-3 bg-gradient-to-br from-gray-800/50 to-gray-800/30 rounded-2xl border border-gray-800/50">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full blur-md opacity-50" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full flex items-center justify-center text-sm font-bold border-2 border-gray-600">
                {username[0].toUpperCase()}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">@{username}</p>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-emerald-400 font-medium">Online</span>
              </div>
            </div>
          </div>

          <button
            onClick={signOut}
            className="flex items-center gap-3 text-gray-400 hover:text-red-400 transition-all w-full px-4 py-2.5 rounded-xl hover:bg-red-500/10 group"
          >
            <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
            <span className="font-medium">Logout</span>
          </button>
        </motion.div>
      </aside>
    </>
  )
}
