/**
 * Supabase / fetch が返す英語メッセージをユーザー向けの日本語に寄せる
 */
export function toAuthUserMessage(message: string): string {
  const lower = message.toLowerCase()
  if (lower.includes('violates row-level security') || lower.includes('new row violates')) {
    return [
      'データベースの行レベルセキュリティ（RLS）により登録が拒否されました。',
      'Supabase の SQL Editor でリポジトリの「supabase/fix-properties-rls-complete.sql」の内容を実行し、',
      'ログアウト後に再度ログインしてから試してください。',
    ].join('')
  }
  if (
    lower.includes('failed to fetch') ||
    lower.includes('networkerror') ||
    lower.includes('load failed') ||
    lower.includes('network request failed')
  ) {
    return [
      'サーバーに接続できませんでした。',
      'プロジェクト直下の .env に、Supabase の「Project URL」と「Publishable」キー（ダッシュボードの Settings → API Keys で確認）が正しく入っているか確認してください。',
      'プレースホルダーのままでは動きません。変更後は開発サーバー（npm run dev）を再起動してください。',
      'それでも直らない場合は、ネットワーク・VPN・広告ブロック拡張の影響も確認してください。',
    ].join('')
  }
  return message
}
