import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/** Vercel / .env で値を引用符付きでコピーしたときの除去 */
function normalizeEnvValue(raw: string): string {
  let v = raw.trim()
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1).trim()
  }
  return v
}

const supabaseUrl = normalizeEnvValue(
  import.meta.env.VITE_SUPABASE_URL ?? '',
)
const supabasePublishableKey = normalizeEnvValue(
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? '',
)

function isValidHttpUrlForClient(url: string): boolean {
  try {
    const u = new URL(url)
    return u.protocol === 'https:' || u.protocol === 'http:'
  } catch {
    return false
  }
}

function createSupabaseOrNull(): SupabaseClient | null {
  if (!supabaseUrl || !supabasePublishableKey) {
    return null
  }
  if (!isValidHttpUrlForClient(supabaseUrl)) {
    console.warn(
      '[supabase] VITE_SUPABASE_URL が有効な URL（https://...supabase.co など）ではありません。Vercel の Environment Variables の値を確認し、再デプロイしてください。',
    )
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
