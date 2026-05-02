// app/[username]/bots/[botId]/settings/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, Save, Loader2, Settings2, Zap, MessageSquare, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function BotSettingsPage() {
  const { username, botId } = useParams() as { username: string; botId: string }
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [activeTab, setActiveTab] = useState('basic')

  useEffect(() => {
    fetchSettings()
  }, [botId])

  const fetchSettings = async () => {
    const res = await fetch(`/api/bots/${botId}/settings`)
    const data = await res.json()
    setSettings(data.settings || {
      prefix: '!',
      bot_name: 'Asuma Bot',
      auto_read: true,
      auto_typing: false,
      auto_typing_type: 'typing',
      auto_read_sw: false,
      anti_call: false,
      anti_spam: true,
      group_only: false,
      private_only: false,
      owner_only: false,
      admin_only: false,
      premium_only: false,
      custom_reply: '',
      welcome_message: '',
      response_wait: '⏳ Tunggu sebentar...',
      response_error: '❌ Terjadi kesalahan!',
      response_limit: 'Limit kamu habis!',
      response_success: '✅ Berhasil!',
      response_cooldown: 'Tunggu sebentar...',
    })
    setLoading(false)
  }

  const update = (key: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }))
  }

  const save = async () => {
    setSaving(true)
    await fetch(`/api/bots/${botId}/settings`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })
    setSaving(false)
    setToast('Berhasil disimpan!')
    setTimeout(() => setToast(''), 3000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="relative"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 p-[2px]">
            <div className="w-full h-full rounded-2xl bg-gray-950 flex items-center justify-center">
              <Settings2 size={24} className="text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div className="absolute -inset-2 bg-blue-500/20 rounded-3xl blur-xl animate-pulse" />
        </motion.div>
      </div>
    )
  }

  const tabs = [
    { id: 'basic', label: 'Basic', icon: Settings2 },
    { id: 'auto', label: 'Auto Features', icon: Zap },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <Link
        href={`/${username}/bots/${botId}`}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
      >
        <ArrowLeft size={20} />
        <span className="text-sm">Kembali</span>
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Settings Bot</h1>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl transition-all text-sm font-medium hover:shadow-lg hover:shadow-blue-500/25"
        >
          {saving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          Simpan
        </motion.button>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-xl p-3 mb-4 text-sm text-center flex items-center justify-center gap-2"
          >
            <CheckCircle size={16} />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-1 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-1 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {activeTab === 'basic' && (
          <>
            <SettingInput
              label="Bot Name"
              value={settings.bot_name || ''}
              onChange={(v) => update('bot_name', v)}
            />
            <SettingInput
              label="Command Prefix"
              value={settings.prefix || ''}
              onChange={(v) => update('prefix', v)}
              maxLength={3}
              className="w-24"
            />
          </>
        )}

        {activeTab === 'auto' && (
          <>
            <SettingToggle
              label="Auto Read"
              desc="Otomatis baca pesan masuk"
              value={settings.auto_read}
              onChange={(v) => update('auto_read', v)}
            />
            <SettingToggle
              label="Auto Typing"
              desc="Tampilkan indikator mengetik"
              value={settings.auto_typing}
              onChange={(v) => update('auto_typing', v)}
            />

            <AnimatePresence>
              {settings.auto_typing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 overflow-hidden"
                >
                  <p className="text-sm font-medium text-gray-400 mb-3">Auto Typing Type</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => update('auto_typing_type', 'typing')}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        settings.auto_typing_type === 'typing'
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/20'
                          : 'bg-white/[0.03] border border-white/[0.06] text-gray-400 hover:bg-white/[0.05]'
                      }`}
                    >
                      ✍️ Typing ...
                    </button>
                    <button
                      onClick={() => update('auto_typing_type', 'recording')}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        settings.auto_typing_type === 'recording'
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/20'
                          : 'bg-white/[0.03] border border-white/[0.06] text-gray-400 hover:bg-white/[0.05]'
                      }`}
                    >
                      🎤 Recording ...
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <SettingToggle
              label="Auto Read Story"
              desc="Lihat & react story otomatis"
              value={settings.auto_read_sw}
              onChange={(v) => update('auto_read_sw', v)}
            />
            <SettingToggle
              label="Anti Call"
              desc="Tolak otomatis panggilan"
              value={settings.anti_call}
              onChange={(v) => update('anti_call', v)}
            />
            <SettingToggle
              label="Anti Spam"
              desc="Proteksi dari spam"
              value={settings.anti_spam}
              onChange={(v) => update('anti_spam', v)}
            />

            <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent my-2" />

            <SettingToggle
              label="Group Only"
              desc="Hanya merespon di grup"
              value={settings.group_only}
              onChange={(v) => update('group_only', v)}
            />
            <SettingToggle
              label="Private Only"
              desc="Hanya merespon di private chat"
              value={settings.private_only}
              onChange={(v) => update('private_only', v)}
            />
            <SettingToggle
              label="Owner Only"
              desc="Hanya merespon owner"
              value={settings.owner_only}
              onChange={(v) => update('owner_only', v)}
            />
            <SettingToggle
              label="Admin Only"
              desc="Hanya admin grup yang bisa"
              value={settings.admin_only}
              onChange={(v) => update('admin_only', v)}
            />
            <SettingToggle
              label="Premium Only"
              desc="Hanya user premium"
              value={settings.premium_only}
              onChange={(v) => update('premium_only', v)}
            />
          </>
        )}

        {activeTab === 'messages' && (
          <>
            <SettingInput
              label="Welcome Message"
              value={settings.welcome_message || ''}
              onChange={(v) => update('welcome_message', v)}
              type="textarea"
            />
            <SettingInput
              label="Custom Reply"
              value={settings.custom_reply || ''}
              onChange={(v) => update('custom_reply', v)}
              type="textarea"
            />
            <SettingInput
              label="Response: Wait"
              value={settings.response_wait || ''}
              onChange={(v) => update('response_wait', v)}
            />
            <SettingInput
              label="Response: Error"
              value={settings.response_error || ''}
              onChange={(v) => update('response_error', v)}
            />
            <SettingInput
              label="Response: Limit"
              value={settings.response_limit || ''}
              onChange={(v) => update('response_limit', v)}
            />
            <SettingInput
              label="Response: Success"
              value={settings.response_success || ''}
              onChange={(v) => update('response_success', v)}
            />
            <SettingInput
              label="Response: Cooldown"
              value={settings.response_cooldown || ''}
              onChange={(v) => update('response_cooldown', v)}
            />
          </>
        )}
      </div>
    </motion.div>
  )
}

function SettingToggle({
  label,
  desc,
  value,
  onChange,
}: {
  label: string
  desc: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 flex items-center justify-between hover:border-blue-500/20 transition-all group">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
          value ? 'bg-blue-500' : 'bg-gray-600'
        }`}
      >
        <motion.div
          animate={{ left: value ? 28 : 4 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className={`w-5 h-5 rounded-full absolute top-1 shadow-lg ${
            value ? 'bg-white' : 'bg-gray-300'
          }`}
        />
      </button>
    </div>
  )
}

function SettingInput({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  maxLength,
  className,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  maxLength?: number
  className?: string
}) {
  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 hover:border-blue-500/20 transition-all">
      <p className="text-sm font-medium text-gray-400 mb-2">{label}</p>
      {type === 'textarea' ? (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
          rows={3}
        />
      ) : (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all ${className || 'w-full'}`}
        />
      )}
    </div>
  )
}
