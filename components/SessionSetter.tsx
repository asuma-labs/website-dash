// components/SessionSetter.tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function SessionSetter({ userId }: { userId: string }) {
  const supabase = createClient()
  const [done, setDone] = useState(false)

  useEffect(() => {
    const setSession = async () => {
      try {
        const res = await fetch('/api/auth/session', { method: 'POST' })
        const data = await res.json()

        if (data.access_token) {
          const { error } = await supabase.auth.setSession({
            access_token: data.access_token,
            refresh_token: data.refresh_token,
          })

          if (error) {
            console.error('Session set error:', error)
          } else {
            console.log('✅ Supabase session set!')
          }
        }
      } catch (err) {
        console.error('SessionSetter error:', err)
      }
      setDone(true)
    }

    setSession()
  }, [userId])

  return null
}
