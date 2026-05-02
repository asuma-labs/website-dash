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

      r.cookie = document.cookie

      const sessionRes = await fetch('/api/auth/session', { method: 'POST' })
      r.apiSession = await sessionRes.json()

      const { data } = await supabase.auth.getSession()
      r.supabaseSession = data

      if (r.apiSession.access_token) {
        await supabase.auth.setSession({
          access_token: r.apiSession.access_token,
          refresh_token: r.apiSession.refresh_token,
        })
        r.sessionSet = 'done'

        const { data: bots } = await supabase.from('bot_instances').select('*').limit(3)
        r.bots = bots
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
