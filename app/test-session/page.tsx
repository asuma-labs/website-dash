// app/test-session/page.tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function TestSessionPage() {
  const supabase = createClient()
  const [results, setResults] = useState<any>({})

  useEffect(() => {
    const runTests = async () => {
      const r: any = {}

      const sessionRes = await fetch('/api/auth/session', { method: 'POST' })
      r.apiSession = await sessionRes.json()

      if (r.apiSession.access_token) {
        await supabase.auth.setSession({
          access_token: r.apiSession.access_token,
          refresh_token: r.apiSession.refresh_token,
        })

        const { data: sessionData } = await supabase.auth.getSession()
        r.supabaseSession = sessionData

        const { data: bots, error } = await supabase.from('bot_instances').select('*').limit(3)
        r.bots = bots
        r.botsError = error

        const { data: allBots, error: allError } = await supabase.from('bot_instances').select('*', { count: 'exact' })
        r.allBotsCount = allBots?.length
        r.allBotsError = allError
      }

      setResults(r)
    }

    runTests()
  }, [])

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-4">Session Test</h1>
      <pre className="bg-gray-900 p-4 rounded-xl text-xs overflow-auto">
        {JSON.stringify(results, null, 2)}
      </pre>
    </div>
  )
}
