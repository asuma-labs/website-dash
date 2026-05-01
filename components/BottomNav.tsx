// components/BottomNav.tsx
'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Home, Bot, Plus, Settings, User } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function BottomNav({ username }: { username: string }) {
  const pathname = usePathname()
  const [showCreate, setShowCreate] = useState(false)

  const tabs = [
    { href: `/${username}`, label: 'Home', icon: Home },
    { href: `/${username}/bots`, label: 'Bot', icon: Bot },
    { action: 'create', label: '', icon: Plus },
    { href: `/${username}/settings`, label: 'Settings', icon: Settings },
    { href: `/${username}/profile`, label: 'Profile', icon: User },
  ]

  return (
    <>
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
      >
        <div className="mx-4 mb-4">
          <div className="relative bg-gray-900/80 backdrop-blur-3xl border border-white/[0.06] rounded-3xl shadow-2xl shadow-black/50 px-2 py-3">
            <div className="absolute inset-0 bg-gradient-to-t from-white/[0.02] to-transparent rounded-3xl pointer-events-none" />

            <div className="flex items-center justify-around relative">
              {tabs.map((tab, i) => {
                const isActive = tab.href ? pathname === tab.href : false

                if (tab.action === 'create') {
                  return (
                    <div key="create" className="relative -mt-8">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowCreate(!showCreate)}
                        className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/30 border-2 border-gray-900"
                      >
                        <motion.div
                          animate={{ rotate: showCreate ? 45 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Plus size={28} className="text-white" strokeWidth={2.5} />
                        </motion.div>
                      </motion.button>

                      {showCreate && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setShowCreate(false)} />
                          <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-3 shadow-2xl w-48 z-50"
                          >
                            <Link
                              href={`/${username}/bots/new`}
                              onClick={() => setShowCreate(false)}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.05] rounded-xl transition text-sm"
                            >
                              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                <Bot size={16} className="text-emerald-400" />
                              </div>
                              <span className="text-white font-medium">Bot Baru</span>
                            </Link>
                          </motion.div>
                        </>
                      )}
                    </div>
                  )
                }

                return (
                  <Link
                    key={tab.href}
                    href={tab.href!}
                    className={`relative flex flex-col items-center gap-1 px-3 py-1 transition-all ${
                      isActive ? 'text-emerald-400' : 'text-gray-500'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="bottomActive"
                        className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-emerald-400 rounded-full"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <tab.icon
                      size={22}
                      strokeWidth={isActive ? 2.5 : 2}
                      className={isActive ? 'drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]' : ''}
                    />
                    <span className="text-[10px] font-medium">{tab.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </motion.nav>
    </>
  )
}
