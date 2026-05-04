import { isSupabaseEnvPlaceholder } from '../lib/supabaseEnv'

/**
 * Supabase の URL／キーが未設定またはプレースホルダーのときに表示する注意バナー
 */
export function SupabaseConfigBanner() {
  if (!isSupabaseEnvPlaceholder()) {
    return null
  }

  return (
    <div className="config-banner" role="status">
      <strong>Supabase の接続設定が必要です。</strong>
      <span>
        プロジェクト直下の <code className="config-banner__code">.env</code> 内の{' '}
        <code className="config-banner__code">VITE_SUPABASE_URL</code> と{' '}
        <code className="config-banner__code">VITE_SUPABASE_PUBLISHABLE_KEY</code>{' '}
        を、Supabase ダッシュボードの「Settings（設定）」→「API Keys」で確認できる実際の値に差し替えてください。編集後は{' '}
        <code className="config-banner__code">npm run dev</code> を再起動してください。
      </span>
    </div>
  )
}
