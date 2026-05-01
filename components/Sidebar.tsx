// components/Sidebar.tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Home, Bot, Settings, LogOut, Zap, Sparkles, Menu, X, Crown, ChevronRight, Command, Plus, MessageSquare, Users, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Sidebar({ username }: { username: string }) {
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

const signOut = async () => {
  await fetch('/api/auth/logout', { method: 'POST' })
  router.push('/login')
}

  const mainLinks = [
    {
      href: `/${username}`,
      label: 'Overview',
      icon: Home,
      gradient: 'from-blue-400 to-cyan-400',
      badge: null,
    },
    {
      href: `/${username}/bots`,
      label: 'Bot Saya',
      icon: Bot,
      gradient: 'from-blue-500 to-indigo-500',
      badge: '3',
    },
    {
      href: `/${username}/chat`,
      label: 'Chat',
      icon: MessageSquare,
      gradient: 'from-sky-400 to-blue-500',
      badge: null,
    },
    {
      href: `/${username}/stats`,
      label: 'Statistics',
      icon: BarChart3,
      gradient: 'from-cyan-400 to-teal-400',
      badge: 'New',
    },
  ]

  const bottomLinks = [
    {
      href: `/${username}/settings`,
      label: 'Settings',
      icon: Settings,
      gradient: 'from-slate-400 to-gray-500',
    },
  ]

  const quickActions = [
    { icon: Plus, label: 'New Bot', href: `/${username}/bots/new`, gradient: 'from-blue-400 to-cyan-400' },
    { icon: Sparkles, label: 'Templates', href: `/${username}/templates`, gradient: 'from-indigo-400 to-purple-400' },
  ]

  return (
    <>
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-50 p-3 bg-gray-950/80 backdrop-blur-xl rounded-2xl border border-white/[0.08] shadow-2xl shadow-black/40 group"
      >
        <Menu size={22} className="text-blue-400 group-hover:text-white transition-colors" />
        <div className="absolute inset-0 rounded-2xl bg-blue-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-md"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className={`
          fixed top-0 left-0 h-full z-40
          lg:translate-x-0
          transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          className="h-full flex flex-col pl-3 py-3 lg:pl-4 lg:py-4"
        >
          <div className="relative flex flex-col h-full bg-gray-950/70 backdrop-blur-3xl border border-white/[0.06] rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.03)] overflow-hidden w-72">
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
            <div className="absolute -bottom-20 -right-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex flex-col h-full p-5">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileOpen(false)}
                className="lg:hidden absolute top-4 right-4 p-2.5 hover:bg-white/[0.08] rounded-xl transition z-10 group"
              >
                <X size={18} className="text-gray-400 group-hover:text-white transition-colors" />
              </motion.button>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <Link href={`/${username}`} className="flex items-center gap-3.5 group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/40 rounded-2xl blur-xl group-hover:blur-2xl group-hover:bg-blue-400/50 transition-all duration-500" />
                    <div className="relative w-12 h-12 bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/25 border border-white/15 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent" />
                      <img src="/icons/android-chrome-192x192.png" alt="Asuma" className="w-7 h-7 relative z-10 drop-shadow-lg" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-gray-950 shadow-lg shadow-emerald-400/50" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                      Asuma MD
                    </h1>
                    <p className="text-[11px] text-gray-400 font-medium tracking-wide">@{username}</p>
                  </div>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-4"
              >
                <div className="flex gap-2">
                  {quickActions.map((action) => (
                    <Link
                      key={action.href}
                      href={action.href}
                      className="flex-1 group/action"
                    >
                      <div className="relative p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-blue-500/20 transition-all duration-300 text-center cursor-pointer">
                        <div className={`w-8 h-8 mx-auto mb-1.5 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg group-hover/action:scale-110 transition-transform duration-300`}>
                          <action.icon size={14} className="text-white" />
                        </div>
                        <span className="text-[10px] font-medium text-gray-400 group-hover/action:text-gray-200 transition-colors">
                          {action.label}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>

              <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-4" />

              <nav className="flex-1 space-y-1">
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest px-3 mb-2">
                  Menu
                </p>
                {mainLinks.map(({ href, label, icon: Icon, gradient, badge }, i) => {
                  const isActive = pathname === href
                  return (
                    <motion.div
                      key={href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.05 }}
                    >
                      <Link
                        href={href}
                        className={`relative flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-300 group ${
                          isActive
                            ? 'text-white'
                            : 'text-gray-400 hover:text-gray-200'
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeSidebar"
                            className="absolute inset-0 bg-gradient-to-r from-blue-500/15 to-cyan-500/10 rounded-2xl border border-blue-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                          />
                        )}

                        <div className="absolute inset-0 bg-white/[0.03] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div
                          className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            isActive
                              ? `bg-gradient-to-br ${gradient} shadow-lg`
                              : 'group-hover:bg-white/[0.06]'
                          }`}
                        >
                          <Icon
                            size={16}
                            className={`transition-all duration-300 ${
                              isActive
                                ? 'text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]'
                                : 'text-gray-400 group-hover:text-gray-200'
                            }`}
                          />
                        </div>

                        <span className="text-sm font-medium relative z-10">{label}</span>

                        {badge && (
                          <span
                            className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full relative z-10 ${
                              badge === 'New'
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                : 'bg-white/[0.06] text-gray-400 border border-white/[0.08]'
                            }`}
                          >
                            {badge}
                          </span>
                        )}

                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, x: -4 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="absolute -right-1 top-1/2 -translate-y-1/2"
                          >
                            <ChevronRight size={12} className="text-blue-400" />
                          </motion.div>
                        )}
                      </Link>
                    </motion.div>
                  )
                })}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="relative mt-auto space-y-2"
              >
                {bottomLinks.map(({ href, label, icon: Icon, gradient }) => {
                  const isActive = pathname === href
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-300 group ${
                        isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeSidebar"
                          className="absolute inset-0 bg-gradient-to-r from-blue-500/15 to-cyan-500/10 rounded-2xl border border-blue-500/20"
                          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <div className="absolute inset-0 bg-white/[0.03] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div
                        className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                          isActive ? `bg-gradient-to-br ${gradient} shadow-lg` : 'group-hover:bg-white/[0.06]'
                        }`}
                      >
                        <Icon size={16} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'} />
                      </div>
                      <span className="text-sm font-medium">{label}</span>
                    </Link>
                  )
                })}

                <div className="relative rounded-2xl bg-white/[0.03] border border-white/[0.06] p-3 hover:bg-white/[0.05] transition-all duration-300 group">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-400/30 rounded-full blur-md group-hover:blur-lg transition-all" />
                      <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-sm font-bold border-2 border-white/15 shadow-lg">
                        {username[0].toUpperCase()}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-gray-950 shadow-lg shadow-emerald-400/50 animate-pulse" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">@{username}</p>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                        <span className="text-[10px] text-emerald-400 font-medium">Online</span>
                      </div>
                    </div>

                    <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20 group/badge">
                      <Crown size={13} className="text-white" />
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent rounded-xl opacity-0 group-hover/badge:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={signOut}
                  className="flex items-center gap-3 text-gray-400 hover:text-red-400 transition-all w-full px-3 py-2.5 rounded-2xl hover:bg-red-500/8 group"
                >
                  <LogOut size={16} className="group-hover:-translate-x-0.5 transition-transform duration-300" />
                  <span className="text-sm font-medium">Logout</span>
                  <div className="absolute inset-0 bg-red-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </aside>
    </>
  )
}
