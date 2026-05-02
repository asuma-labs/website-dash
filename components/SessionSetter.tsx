// components/SessionSetter.tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect } from 'react'

export default function SessionSetter({ userId }: { userId: string }) {
  const supabase = createClient()

  useEffect(() => {
    const setSession = async () => {
      const res = await fetch('/api/auth/session', { method: 'POST' })
      const data = await res.json()

      if (data.access_token) {
        await supabase.auth.setSession({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        })
      }
    }

    setSession()
  }, [userId])

  return null
}
