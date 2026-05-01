// app/[username]/bots/new/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewBotPage({ params }: { params: { username: string } }) {
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [pairingCode, setPairingCode] = useState('')
  const [botId, setBotId] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setPairingCode('')

    const cleanPhone = phone.replace(/[^0-9]/g, '')

    const res = await fetch('/api/bots/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number: cleanPhone, bot_name: name || 'Asuma Bot' }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Gagal membuat bot')
      setLoading(false)
      return
    }

    setBotId(data.bot_instance_id)

    supabase
      .channel('pairing-' + data.bot_instance_id)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bot_instances',
          filter: `id=eq.${data.bot_instance_id}`,
        },
        (payload: any) => {
          if (payload.new.pairing_code) {
            setPairingCode(payload.new.pairing_code)
            setLoading(false)
          }
          if (payload.new.status === 'connected') {
            router.push(`/${params.username}/bots/${data.bot_instance_id}`)
          }
        }
      )
      .subscribe()

    setTimeout(async () => {
      const { data: bot } = await supabase
        .from('bot_instances')
        .select('pairing_code')
        .eq('id', data.bot_instance_id)
        .single()

      if (bot?.pairing_code && !pairingCode) {
        setPairingCode(bot.pairing_code)
        setLoading(false)
      }
    }, 10000)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href={`/${params.username}/bots`}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
      >
        <ArrowLeft size={20} />
        Kembali
      </Link>

      <h1 className="text-2xl font-bold mb-8">Tambah Bot Baru</h1>

      {!pairingCode ? (
        <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Nomor WhatsApp</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="6281234567890"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Masukkan nomor dengan kode negara (62xxx)</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Nama Bot (opsional)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Bot Gaming"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg p-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition"
          >
            {loading ? 'Memproses...' : 'Buat Bot'}
          </button>
        </form>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">🔑</div>
          <h2 className="text-xl font-bold mb-2">Kode Pairing</h2>
          <p className="text-gray-400 mb-6">Masukkan kode ini di WhatsApp kamu</p>

          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <p className="text-4xl font-mono font-bold text-green-400 tracking-widest">{pairingCode}</p>
          </div>

          <p className="text-sm text-gray-500">
            Buka WhatsApp → Perangkat Tertaut → Tautkan Perangkat → Masukkan kode di atas
          </p>
        </div>
      )}
    </div>
  )
}
