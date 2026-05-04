import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL ?? '').trim()
const supabasePublishableKey = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? '').trim()

function createSupabaseOrNull(): SupabaseClient | null {
  if (!supabaseUrl || !supabasePublishableKey) {
    return null
  }
  try {
    return createClient(supabaseUrl, supabasePublishableKey)
  } catch (e) {
    console.error('[supabase] createClient failed', e)
    return null
  }
}

/**
 * Supabase クライアント（ブラウザ用・Publishable key を使用）
 * 環境変数が無い、または createClient に失敗した場合は null
 */
export const supabase: SupabaseClient | null = createSupabaseOrNull()
