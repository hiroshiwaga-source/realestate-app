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
        ローカルではプロジェクト直下の <code className="config-banner__code">.env</code> に{' '}
        <code className="config-banner__code">VITE_SUPABASE_URL</code> と{' '}
        <code className="config-banner__code">VITE_SUPABASE_PUBLISHABLE_KEY</code>{' '}
        を設定してください。本番（Vercel）では Project Settings → Environment
        Variables に同じ名前で登録し、再デプロイしてください。値は Supabase の「Settings」→「API
        Keys」で確認できます。ローカルで .env を編集したら{' '}
        <code className="config-banner__code">npm run dev</code> を再起動してください。
      </span>
    </div>
  )
}
