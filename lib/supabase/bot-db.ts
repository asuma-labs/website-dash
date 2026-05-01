// lib/supabase/bot-db.ts
import { createClient } from '@supabase/supabase-js'

export const createBotDB = () =>
  createClient(
    process.env.SUPABASE2_URL!,
    process.env.SUPABASE2_SERVICE_ROLE_KEY!
  )
