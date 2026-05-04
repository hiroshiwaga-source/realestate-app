import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL ?? '').trim()
const supabasePublishableKey = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? '').trim()

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    '環境変数 VITE_SUPABASE_URL と VITE_SUPABASE_PUBLISHABLE_KEY を .env に設定してください。',
  )
}

/**
 * Supabase クライアント（ブラウザ用・Publishable key を使用）
 */
export const supabase = createClient(supabaseUrl, supabasePublishableKey)
