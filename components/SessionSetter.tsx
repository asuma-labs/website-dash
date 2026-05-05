'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useRef } from 'react'

export default function SessionSetter({ userId }: { userId: string }) {
  const supabase = createClient()
  const mounted = useRef(false)

  useEffect(() => {
    if (mounted.current) return
    
    const setSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) return

        const res = await fetch('/api/auth/session', { method: 'POST' })
        if (!res.ok) return
        
        const data = await res.json()

        if (data.access_token) {
          await supabase.auth.setSession({
            access_token: data.access_token,
            refresh_token: data.refresh_token,
          })
        }
      } catch (err) {
        console.error(err)
      } finally {
        mounted.current = true
      }
    }

    setSession()
  }, [userId, supabase.auth])

  return null
}
