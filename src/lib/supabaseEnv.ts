/**
 * .env がデモ用プレースホルダーのままかどうか（接続失敗の典型的な原因）
 *
 * コピペで混入した空白は trim してから判定する。
 * 「xxxxxxxx」を単純に含むだけではプレースホルダーとみなさない（誤検知防止）。
 */
export function isSupabaseEnvPlaceholder(): boolean {
  const url = (import.meta.env.VITE_SUPABASE_URL ?? '').trim()
  const key = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? '').trim()

  if (!url || !key) {
    return true
  }

  // テンプレで用意していたダミーキーそのもの
  if (
    key === 'sb-publishable-xxxxxxxx' ||
    key === 'sb_publishable_xxxxxxxx' ||
    url === 'https://xxxxxxxx.supabase.co'
  ) {
    return true
  }

  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'https:') {
      return true
    }
    if (!parsed.hostname.endsWith('.supabase.co')) {
      return true
    }
    // プロジェクト参照がテンプレの xxxxxxxx のみならプレースホルダー
    const projectRef = parsed.hostname.replace(/\.supabase\.co$/i, '')
    if (projectRef === 'xxxxxxxx') {
      return true
    }
  } catch {
    return true
  }

  // Publishable（sb_publishable_*）またはレガシー anon JWT（eyJ で始まる長い文字列）を想定
  const looksLikePublishable =
    key.startsWith('sb_publishable_') || key.startsWith('sb-publishable-')
  const looksLikeLegacyAnon = key.startsWith('eyJ') && key.length > 80

  if (!looksLikePublishable && !looksLikeLegacyAnon) {
    return true
  }

  return false
}
