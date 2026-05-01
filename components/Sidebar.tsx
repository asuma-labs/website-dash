// components/Sidebar.tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Home, Bot, Settings, LogOut, Zap, Sparkles, Menu, X, Crown } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Sidebar({ username }: { username: string }) {
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const links = [
    { href: `/${username}`, label: 'Overview', icon: Home, gradient: 'from-emerald-400 to-cyan-400' },
    { href: `/${username}/bots`, label: 'Bot Saya', icon: Bot, gradient: 'from-violet-400 to-purple-400' },
    { href: `/${username}/settings`, label: 'Settings', icon: Settings, gradient: 'from-amber-400 to-orange-400' },
  ]

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-50 p-3 bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-700/30 shadow-2xl"
      >
        <Menu size={22} className="text-white" />
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
        lg:translate-x-0
        transition-transform duration-500 ease-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <motion.div initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }} className="h-full flex flex-col pl-4 py-4">
          <div className="relative flex flex-col h-full bg-gray-950/60 backdrop-blur-3xl border border-white/[0.06] rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden w-64">
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex flex-col h-full p-5">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileOpen(false)}
                className="lg:hidden absolute top-4 right-4 p-2 hover:bg-white/10 rounded-xl transition z-10"
              >
                <X size={18} className="text-gray-400" />
              </motion.button>

              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <Link href={`/${username}`} className="flex items-center gap-3 group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                    <div className="relative w-11 h-11 bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/20 border border-white/10">
                      <img src="/icons/android-chrome-192x192.png" alt="Asuma" className="w-7 h-7" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-base font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      Asuma MD
                    </h1>
                    <p className="text-[11px] text-gray-500 font-medium">@{username}</p>
                  </div>
                </Link>
              </motion.div>

              <nav className="flex-1 space-y-1">
                {links.map(({ href, label, icon: Icon, gradient }, i) => {
                  const isActive = pathname === href
                  return (
                    <motion.div key={href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
                      <Link
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        className={`relative flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-300 group ${
                          isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-white/[0.06] rounded-2xl border border-white/[0.08]"
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                        <div className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                          isActive ? `bg-gradient-to-br ${gradient} shadow-lg` : 'group-hover:bg-white/[0.05]'
                        }`}>
                          <Icon size={16} className={isActive ? 'text-white' : ''} />
                        </div>
                        <span className="text-sm font-medium">{label}</span>
                      </Link>
                    </motion.div>
                  )
                })}
              </nav>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="relative mt-auto">
                <div className="relative rounded-2xl bg-white/[0.03] border border-white/[0.06] p-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-400/30 rounded-full blur-md" />
                      <div className="relative w-9 h-9 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white/10">
                        {username[0].toUpperCase()}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">@{username}</p>
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="text-emerald-400 font-medium">Online</span>
                      </div>
                    </div>
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <Crown size={12} className="text-amber-400" />
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={signOut}
                  className="flex items-center gap-3 text-gray-400 hover:text-red-400 transition-all w-full px-3 py-2.5 rounded-2xl hover:bg-red-500/5 group"
                >
                  <LogOut size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                  <span className="text-sm font-medium">Logout</span>
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </aside>
    </>
  )
}
