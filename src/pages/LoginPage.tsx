import { FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { SupabaseConfigBanner } from '../components/SupabaseConfigBanner'
import { useAuth } from '../context/useAuth'

/**
 * メールアドレス・パスワードでログイン
 */
export function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/'

  // 会員登録直後のフラグは初回マウント時のみ保持（URL の state クリア後も表示するため）
  const [showRegisteredNotice] = useState(
    () => (location.state as { registered?: boolean })?.registered === true,
  )

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (showRegisteredNotice) {
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [showRegisteredNotice, navigate, location.pathname])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErrorMessage(null)
    setSubmitting(true)
    const { error } = await signIn(email.trim(), password)
    setSubmitting(false)
    if (error) {
      setErrorMessage(error.message)
      return
    }
    navigate(from, { replace: true })
  }

  return (
    <div className="page-centered">
      <div className="auth-panel">
        <SupabaseConfigBanner />
        <h1 className="auth-panel__title">ログイン</h1>
        {showRegisteredNotice ? (
          <p className="form-info" role="status">
            会員登録が完了しました。メール確認が必要な場合は案内に従ってからログインしてください。
          </p>
        ) : null}
        <form className="auth-form" onSubmit={handleSubmit}>
          {errorMessage ? (
            <p className="form-error" role="alert">
              {errorMessage}
            </p>
          ) : null}
          <label className="auth-form__label">
            メールアドレス
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="auth-form__label">
            パスワード
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? '送信中...' : 'ログイン'}
          </button>
        </form>
        <p className="auth-panel__footer">
          アカウントをお持ちでない方は{' '}
          <Link to="/register">会員登録</Link>
        </p>
      </div>
    </div>
  )
}
