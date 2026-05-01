// components/BottomNav.tsx
'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Home, Bot, Plus, Settings, User, Sparkles, Globe, MessageSquare, X, Search, Zap } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'

export default function BottomNav({ username }: { username: string }) {
  const pathname = usePathname()
  const [showCreate, setShowCreate] = useState(false)
  const [rippleTab, setRippleTab] = useState<string | null>(null)
  const popupRef = useRef<HTMLDivElement>(null)

  // Tutup popup saat route berubah
  useEffect(() => {
    setShowCreate(false)
  }, [pathname])

  // Tutup popup saat klik di luar
  useEffect(() => {
    if (!showCreate) return
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setShowCreate(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showCreate])

  const tabs = [
    { id: 'home', href: `/${username}`, label: 'Home', icon: Home },
    { id: 'explore', href: `/${username}/explore`, label: 'Explore', icon: Globe },
    { id: 'bots', href: `/${username}/bots`, label: 'My Bots', icon: Bot },
    { id: 'settings', href: `/${username}/settings`, label: 'Settings', icon: Settings },
    { id: 'profile', href: `/${username}/profile`, label: 'Profile', icon: User },
  ]

  const createOptions = [
    {
      href: `/${username}/bots/new`,
      icon: Bot,
      label: 'Create Bot',
      desc: 'Build a new AI assistant',
      gradient: 'from-emerald-400 to-green-600',
      glowColor: 'rgba(52, 211, 153, 0.3)',
      hotkey: '⌘N',
    },
    {
      href: `/${username}/bots/templates`,
      icon: Sparkles,
      label: 'Templates',
      desc: 'Start from pre-built',
      gradient: 'from-violet-400 to-purple-600',
      glowColor: 'rgba(167, 139, 250, 0.3)',
      hotkey: '⌘T',
    },
    {
      href: `/${username}/chat/new`,
      icon: MessageSquare,
      label: 'New Chat',
      desc: 'Quick conversation',
      gradient: 'from-sky-400 to-blue-600',
      glowColor: 'rgba(56, 189, 248, 0.3)',
    },
  ]

  const handleRipple = (id: string) => {
    setRippleTab(id)
    setTimeout(() => setRippleTab(null), 600)
  }

  return (
    <>
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
      >
        {/* Garis dekoratif atas nav */}
        <div className="mx-6">
          <motion.div
            className="h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          />
        </div>

        <div className="mx-3 mb-3 mt-2">
          <div className="relative bg-gray-950/70 backdrop-blur-3xl border border-white/[0.08] rounded-3xl shadow-2xl shadow-black/60 px-1 py-2">
            {/* Ambient light effect */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl" />
            </div>

            {/* Inner gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/[0.02] to-transparent rounded-3xl pointer-events-none" />

            <div className="flex items-center justify-around relative">
              {/* Kiri: 2 tab */}
              <div className="flex items-center gap-1">
                {tabs.slice(0, 2).map((tab) => {
                  const isActive = pathname === tab.href
                  return (
                    <Link
                      key={tab.id}
                      href={tab.href}
                      onClick={() => handleRipple(tab.id)}
                      className="relative flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 min-w-[56px] group"
                    >
                      {/* Active pill background */}
                      {isActive && (
                        <motion.div
                          layoutId="bottomNavPill"
                          className="absolute inset-0 bg-emerald-500/20 rounded-2xl border border-emerald-500/20"
                          transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                        />
                      )}

                      {/* Icon container */}
                      <motion.div
                        className="relative"
                        whileTap={{ scale: 0.85 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      >
                        <tab.icon
                          size={21}
                          strokeWidth={isActive ? 2.5 : 1.75}
                          className={`relative z-10 transition-all duration-300 ${
                            isActive
                              ? 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.6)]'
                              : 'text-gray-500 group-hover:text-gray-300'
                          }`}
                        />

                        {/* Ripple effect on click */}
                        <AnimatePresence>
                          {rippleTab === tab.id && (
                            <motion.div
                              initial={{ scale: 0.5, opacity: 1 }}
                              animate={{ scale: 2.5, opacity: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.5, ease: 'easeOut' }}
                              className="absolute inset-0 -z-0 rounded-full bg-emerald-400/30"
                            />
                          )}
                        </AnimatePresence>
                      </motion.div>

                      {/* Label */}
                      <motion.span
                        className={`text-[10px] font-semibold relative z-10 transition-all duration-300 ${
                          isActive ? 'text-emerald-400 scale-110' : 'text-gray-500 group-hover:text-gray-400'
                        }`}
                      >
                        {tab.label}
                      </motion.span>
                    </Link>
                  )
                })}
              </div>

              {/* Tengah: FAB Button */}
              <div className="relative -mt-6 mx-1">
                {/* Pulse ring */}
                <motion.div
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.4, 0, 0.4],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute inset-0 rounded-2xl bg-emerald-400/20"
                />

                <motion.button
                  whileTap={{ scale: 0.85 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowCreate(!showCreate)}
                  className="relative w-[52px] h-[52px] bg-gradient-to-br from-emerald-400 via-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(52,211,153,0.4),0_10px_30px_rgba(0,0,0,0.5)] border-2 border-white/20 overflow-hidden group"
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500" />

                  <motion.div
                    animate={{ rotate: showCreate ? 135 : 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    {showCreate ? (
                      <X size={24} className="text-white relative z-10" strokeWidth={2.5} />
                    ) : (
                      <Plus size={26} className="text-white relative z-10" strokeWidth={2.5} />
                    )}
                  </motion.div>
                </motion.button>
              </div>

              {/* Kanan: 3 tab */}
              <div className="flex items-center gap-1">
                {tabs.slice(2).map((tab) => {
                  const isActive = pathname === tab.href
                  return (
                    <Link
                      key={tab.id}
                      href={tab.href}
                      onClick={() => handleRipple(tab.id)}
                      className="relative flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 min-w-[56px] group"
                    >
                      {isActive && (
                        <motion.div
                          layoutId="bottomNavPill"
                          className="absolute inset-0 bg-emerald-500/20 rounded-2xl border border-emerald-500/20"
                          transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                        />
                      )}

                      <motion.div className="relative" whileTap={{ scale: 0.85 }}>
                        <tab.icon
                          size={21}
                          strokeWidth={isActive ? 2.5 : 1.75}
                          className={`relative z-10 transition-all duration-300 ${
                            isActive
                              ? 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.6)]'
                              : 'text-gray-500 group-hover:text-gray-300'
                          }`}
                        />
                        <AnimatePresence>
                          {rippleTab === tab.id && (
                            <motion.div
                              initial={{ scale: 0.5, opacity: 1 }}
                              animate={{ scale: 2.5, opacity: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.5, ease: 'easeOut' }}
                              className="absolute inset-0 -z-0 rounded-full bg-emerald-400/30"
                            />
                          )}
                        </AnimatePresence>
                      </motion.div>

                      <motion.span
                        className={`text-[10px] font-semibold relative z-10 transition-all duration-300 ${
                          isActive ? 'text-emerald-400 scale-110' : 'text-gray-500 group-hover:text-gray-400'
                        }`}
                      >
                        {tab.label}
                      </motion.span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Popup Create */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            ref={popupRef}
            initial={{ opacity: 0, y: 30, scale: 0.85, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 20, scale: 0.9, filter: 'blur(4px)', transition: { duration: 0.2 } }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-[calc(100vw-2rem)] max-w-[340px]"
          >
            <div className="bg-gray-950/90 backdrop-blur-2xl border border-white/[0.1] rounded-3xl p-4 shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.05)] overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-3 mb-3 px-1">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Zap size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">Quick Actions</h3>
                  <p className="text-gray-500 text-[11px]">Choose what to create</p>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-1.5">
                {createOptions.map((option) => (
                  <Link
                    key={option.href}
                    href={option.href}
                    onClick={() => setShowCreate(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-white/[0.06] transition-all group/item relative overflow-hidden border border-transparent hover:border-white/[0.08]"
                  >
                    {/* Hover gradient glow */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 rounded-2xl"
                      style={{
                        background: `radial-gradient(circle at left center, ${option.glowColor}, transparent 70%)`,
                      }}
                    />

                    <div
                      className={`relative z-10 w-10 h-10 rounded-xl bg-gradient-to-br ${option.gradient} flex items-center justify-center shadow-lg flex-shrink-0`}
                    >
                      <option.icon size={18} className="text-white" />
                    </div>

                    <div className="relative z-10 flex-1 min-w-0">
                      <p className="text-white text-sm font-medium">{option.label}</p>
                      <p className="text-gray-500 text-[11px]">{option.desc}</p>
                    </div>

                    {/* Hotkey badge */}
                    {option.hotkey && (
                      <kbd className="relative z-10 hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white/[0.06] border border-white/[0.08] text-[10px] text-gray-400 font-mono">
                        {option.hotkey}
                      </kbd>
                    )}

                    {/* Arrow indicator */}
                    <motion.div
                      className="relative z-10 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-200"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M4 2L8 6L4 10"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-gray-400"
                        />
                      </svg>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Triangle pointer */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
              <svg width="20" height="10" viewBox="0 0 20 10">
                <polygon points="10,10 0,0 20,0" className="fill-gray-950" />
                <polygon points="10,10 1,0 19,0" className="fill-white/[0.1]" />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
