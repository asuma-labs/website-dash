// components/DashboardNav.tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Home, Bot, Settings, LogOut, Zap, Sparkles, Menu, X, Crown, Gift, Store } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function DashboardNav({ username }: { username: string }) {
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const mainLinks = [
    { href: `/${username}`, label: 'Overview', icon: Home, gradient: 'from-emerald-400 to-cyan-400', shadow: 'shadow-emerald-500/20' },
    { href: `/${username}/bots`, label: 'Bot Saya', icon: Bot, gradient: 'from-violet-400 to-purple-400', shadow: 'shadow-violet-500/20' },
  ]

  const bottomLinks = [
    { href: `/${username}/settings`, label: 'Settings', icon: Settings, gradient: 'from-amber-400 to-orange-400', shadow: 'shadow-amber-500/20' },
  ]

  return (
    <>
      <div className="lg:hidden fixed top-4 left-1/2 -translate-x-1/2 z-50">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setMobileOpen(true)}
          className="px-5 py-3 bg-gray-900/80 backdrop-blur-2xl rounded-2xl border border-gray-700/30 shadow-2xl flex items-center gap-2 text-white"
        >
          <Menu size={20} />
          <span className="text-sm font-medium">Menu</span>
        </motion.button>
      </div>

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
        <motion.div 
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          className="h-full flex flex-col pl-4 py-4"
        >
          <div className={`
            relative flex flex-col h-full
            bg-gray-950/60 backdrop-blur-3xl
            border border-white/[0.06]
            rounded-[2rem]
            shadow-[0_8px_32px_rgba(0,0,0,0.4)]
            overflow-hidden
            w-64
          `}>
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
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

              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
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
                <div className="space-y-1">
                  {mainLinks.map(({ href, label, icon: Icon, gradient, shadow }, i) => {
                    const isActive = pathname === href
                    return (
                      <motion.div
                        key={href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                        onHoverStart={() => setHoveredLink(href)}
                        onHoverEnd={() => setHoveredLink(null)}
                      >
                        <Link
                          href={href}
                          onClick={() => setMobileOpen(false)}
                          className={`
                            relative flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-300 group
                            ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}
                          `}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="activeNav"
                              className="absolute inset-0 bg-white/[0.06] rounded-2xl border border-white/[0.08]"
                              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                            />
                          )}
                          {hoveredLink === href && !isActive && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="absolute inset-0 bg-white/[0.03] rounded-2xl"
                            />
                          )}
                          <div className={`
                            relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300
                            ${isActive ? `bg-gradient-to-br ${gradient} ${shadow}` : 'bg-transparent group-hover:bg-white/[0.05]'}
                          `}>
                            <Icon size={16} className={isActive ? 'text-white' : ''} />
                          </div>
                          <span className="text-sm font-medium">{label}</span>
                          {isActive && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
                              <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${gradient}`} />
                            </motion.div>
                          )}
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>

                <div className="py-3">
                  <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                </div>

                <div className="space-y-1">
                  {bottomLinks.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href
                    return (
                      <motion.div
                        key={href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Link
                          href={href}
                          onClick={() => setMobileOpen(false)}
                          className={`
                            relative flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-300 group
                            ${isActive ? 'text-white bg-white/[0.06] border border-white/[0.08]' : 'text-gray-400 hover:text-white'}
                          `}
                        >
                          <div className={`
                            relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300
                            ${isActive ? 'bg-amber-500/20' : 'bg-transparent group-hover:bg-white/[0.05]'}
                          `}>
                            <Icon size={16} />
                          </div>
                          <span className="text-sm font-medium">{label}</span>
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>
              </nav>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative mt-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent pointer-events-none -top-16" />
                
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
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center group-hover:bg-red-500/10 transition-all">
                    <LogOut size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                  </div>
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
