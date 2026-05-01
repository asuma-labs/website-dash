// app/[username]/bots/[botId]/settings/page.tsx
'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function BotSettingsPage() {
  const { username, botId } = useParams() as { username: string; botId: string }
  const supabase = createClient()
  const [settings, setSettings] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    supabase
      .from('bot_settings')
      .select('*')
      .eq('bot_instance_id', botId)
      .single()
      .then(({ data }) => setSettings(data))
  }, [botId])

  const updateSetting = async (key: string, value: any) => {
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
      setToast('Settings berhasil disimpan')
      setTimeout(() => setToast(''), 3000)
    }
  }

  if (!settings) return <div className="text-gray-400">Loading...</div>

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href={`/${username}/bots/${botId}`}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
      >
        <ArrowLeft size={20} />
        Kembali
      </Link>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Bot Settings</h1>
        <button
          onClick={saveSettings}
          disabled={saving}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition text-sm"
        >
          <Save size={16} />
          {saving ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>

      {toast && (
        <div className="bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg p-3 mb-4 text-sm">
          {toast}
        </div>
      )}

      <div className="space-y-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="font-medium">Auto Read</p>
            <p className="text-sm text-gray-400">Otomatis baca pesan masuk</p>
          </div>
          <button
            onClick={() => updateSetting('auto_read', !settings.auto_read)}
            className={`w-14 h-7 rounded-full transition relative ${
              settings.auto_read ? 'bg-green-500' : 'bg-gray-600'
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full absolute top-1 transition ${
                settings.auto_read ? 'left-8' : 'left-1'
              }`}
            />
          </button>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="font-medium">Auto Typing</p>
            <p className="text-sm text-gray-400">Tampilkan indikator mengetik</p>
          </div>
          <button
            onClick={() => updateSetting('auto_typing', !settings.auto_typing)}
            className={`w-14 h-7 rounded-full transition relative ${
              settings.auto_typing ? 'bg-green-500' : 'bg-gray-600'
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full absolute top-1 transition ${
                settings.auto_typing ? 'left-8' : 'left-1'
              }`}
            />
          </button>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="font-medium">Auto Read Story</p>
            <p className="text-sm text-gray-400">Otomatis lihat & react story</p>
          </div>
          <button
            onClick={() => updateSetting('auto_read_sw', !settings.auto_read_sw)}
            className={`w-14 h-7 rounded-full transition relative ${
              settings.auto_read_sw ? 'bg-green-500' : 'bg-gray-600'
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full absolute top-1 transition ${
                settings.auto_read_sw ? 'left-8' : 'left-1'
              }`}
            />
          </button>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="font-medium">Anti Call</p>
            <p className="text-sm text-gray-400">Tolak otomatis panggilan masuk</p>
          </div>
          <button
            onClick={() => updateSetting('anti_call', !settings.anti_call)}
            className={`w-14 h-7 rounded-full transition relative ${
              settings.anti_call ? 'bg-green-500' : 'bg-gray-600'
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full absolute top-1 transition ${
                settings.anti_call ? 'left-8' : 'left-1'
              }`}
            />
          </button>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div>
            <p className="font-medium">Command Prefix</p>
            <p className="text-sm text-gray-400 mb-3">Karakter untuk command bot</p>
          </div>
          <input
            type="text"
            value={settings.prefix || '!'}
            onChange={(e) => updateSetting('prefix', e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500 transition w-24"
            maxLength={3}
          />
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div>
            <p className="font-medium">Bot Name</p>
            <p className="text-sm text-gray-400 mb-3">Nama bot yang ditampilkan</p>
          </div>
          <input
            type="text"
            value={settings.bot_name || ''}
            onChange={(e) => updateSetting('bot_name', e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500 transition w-full"
          />
        </div>
      </div>
    </div>
  )
}
