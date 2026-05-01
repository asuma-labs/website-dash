// app/[username]/settings/page.tsx
'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, Shield, Bell, Palette, ChevronRight, Copy, Check } from 'lucide-react'

export default function SettingsPage() {
  const { username } = useParams() as { username: string }
  const [copied, setCopied] = useState<string | null>(null)
  const [darkMode, setDarkMode] = useState(true)

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
  }

  const settingsSections = [
    {
      title: 'Akun',
      icon: User,
      items: [
        { label: 'Username', value: `@${username}`, copyValue: username },
        { label: 'Dashboard URL', value: `dash.asuma.my.id/${username}`, copyValue: `https://dash.asuma.my.id/${username}` },
      ],
    },
    {
      title: 'Keamanan',
      icon: Shield,
      items: [
        { label: 'Ganti Password', action: 'navigate' as const, href: `/${username}/settings/password` },
      ],
    },
    {
      title: 'Notifikasi',
      icon: Bell,
      items: [
        { label: 'Bot Connected', action: 'toggle' as const, toggleValue: true },
        { label: 'Bot Disconnected', action: 'toggle' as const, toggleValue: false },
      ],
    },
    {
      title: 'Tampilan',
      icon: Palette,
      items: [
        { label: 'Dark Mode', action: 'toggle' as const, toggleValue: darkMode, onChange: () => setDarkMode(!darkMode) },
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
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Kelola akun dan preferensi kamu</p>
      </div>

      {settingsSections.map((section, i) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 rounded-2xl overflow-hidden"
        >
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-800/50">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <section.icon size={16} className="text-emerald-400" />
            </div>
            <h2 className="font-semibold text-sm">{section.title}</h2>
          </div>

          <div>
            {section.items.map((item, j) => (
              <div
                key={item.label}
                className={`flex items-center justify-between px-5 py-4 ${
                  j !== section.items.length - 1 ? 'border-b border-gray-800/30' : ''
                }`}
              >
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  {'value' in item && (
                    <p className="text-xs text-gray-500 mt-0.5 font-mono truncate max-w-[200px]">{item.value}</p>
                  )}
                </div>

                {'copyValue' in item && (
                  <button
                    onClick={() => copyToClipboard(item.copyValue!, item.label)}
                    className="flex items-center gap-2 text-xs text-gray-400 hover:text-emerald-400 transition"
                  >
                    {copied === item.label ? (
                      <>
                        <Check size={14} className="text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                )}

                {item.action === 'navigate' && 'href' in item && (
                  <a href={item.href} className="text-gray-400 hover:text-emerald-400 transition">
                    <ChevronRight size={18} />
                  </a>
                )}

                {item.action === 'toggle' && 'toggleValue' in item && (
                  <button
                    onClick={'onChange' in item ? item.onChange : undefined}
                    className={`w-12 h-7 rounded-full transition relative ${
                      item.toggleValue ? 'bg-emerald-500' : 'bg-gray-600'
                    }`}
                  >
                    <motion.div
                      animate={{ left: item.toggleValue ? '1.75rem' : '0.25rem' }}
                      className="w-5 h-5 bg-white rounded-full absolute top-1 shadow-md"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      <div className="text-center text-xs text-gray-600 py-4">
        Asuma MD v1.0.0 • Made with ❤️
      </div>
    </motion.div>
  )
}
