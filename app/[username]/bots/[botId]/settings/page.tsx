// app/[username]/bots/[botId]/settings/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function BotSettingsPage() {
  const { username, botId } = useParams() as { username: string; botId: string }
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [botId])

  const fetchSettings = async () => {
    const res = await fetch(`/api/bots/${botId}/settings`)
    const data = await res.json()

    if (res.ok && data.settings) {
      setSettings(data.settings)
    } else {
      setSettings({
        auto_read: true,
        auto_typing: false,
        auto_read_sw: false,
        anti_call: false,
        prefix: '!',
        bot_name: 'Asuma Bot',
      })
    }
    setLoading(false)
  }

  const updateSetting = (key: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }))
  }

  const saveSettings = async () => {
    setSaving(true)
    const res = await fetch(`/api/bots/${botId}/settings`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })
    setSaving(false)
    if (res.ok) {
      setToast('Settings berhasil disimpan!')
      setTimeout(() => setToast(''), 3000)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-emerald-400" />
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
      <Link href={`/${username}/bots/${botId}`} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition">
        <ArrowLeft size={20} />
        <span className="text-sm">Kembali</span>
      </Link>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Bot Settings</h1>
        <button
          onClick={saveSettings}
          disabled={saving}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl transition text-sm font-medium"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>

      {toast && (
        <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl p-3 mb-4 text-sm text-center">
          {toast}
        </div>
      )}

      <div className="space-y-4">
        <div className="bg-gray-900/80 border border-gray-800/50 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="font-medium">Auto Read</p>
            <p className="text-sm text-gray-400">Otomatis baca pesan masuk</p>
          </div>
          <button
            onClick={() => updateSetting('auto_read', !settings.auto_read)}
            className={`w-14 h-7 rounded-full transition relative ${settings.auto_read ? 'bg-emerald-500' : 'bg-gray-600'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition ${settings.auto_read ? 'left-8' : 'left-1'}`} />
          </button>
        </div>

        <div className="bg-gray-900/80 border border-gray-800/50 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="font-medium">Auto Typing</p>
            <p className="text-sm text-gray-400">Tampilkan indikator mengetik</p>
          </div>
          <button
            onClick={() => updateSetting('auto_typing', !settings.auto_typing)}
            className={`w-14 h-7 rounded-full transition relative ${settings.auto_typing ? 'bg-emerald-500' : 'bg-gray-600'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition ${settings.auto_typing ? 'left-8' : 'left-1'}`} />
          </button>
        </div>

        <div className="bg-gray-900/80 border border-gray-800/50 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="font-medium">Auto Read Story</p>
            <p className="text-sm text-gray-400">Otomatis lihat & react story</p>
          </div>
          <button
            onClick={() => updateSetting('auto_read_sw', !settings.auto_read_sw)}
            className={`w-14 h-7 rounded-full transition relative ${settings.auto_read_sw ? 'bg-emerald-500' : 'bg-gray-600'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition ${settings.auto_read_sw ? 'left-8' : 'left-1'}`} />
          </button>
        </div>

        <div className="bg-gray-900/80 border border-gray-800/50 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="font-medium">Anti Call</p>
            <p className="text-sm text-gray-400">Tolak otomatis panggilan masuk</p>
          </div>
          <button
            onClick={() => updateSetting('anti_call', !settings.anti_call)}
            className={`w-14 h-7 rounded-full transition relative ${settings.anti_call ? 'bg-emerald-500' : 'bg-gray-600'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition ${settings.anti_call ? 'left-8' : 'left-1'}`} />
          </button>
        </div>

        <div className="bg-gray-900/80 border border-gray-800/50 rounded-2xl p-4">
          <p className="font-medium mb-2">Command Prefix</p>
          <input
            type="text"
            value={settings.prefix || '!'}
            onChange={(e) => updateSetting('prefix', e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500/50 transition w-24"
            maxLength={3}
          />
        </div>

        <div className="bg-gray-900/80 border border-gray-800/50 rounded-2xl p-4">
          <p className="font-medium mb-2">Bot Name</p>
          <input
            type="text"
            value={settings.bot_name || ''}
            onChange={(e) => updateSetting('bot_name', e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500/50 transition w-full"
          />
        </div>
      </div>
    </motion.div>
  )
}
