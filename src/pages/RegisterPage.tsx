import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SupabaseConfigBanner } from '../components/SupabaseConfigBanner'
import { useAuth } from '../context/useAuth'

/**
 * メールアドレス・パスワードで会員登録
 */
export function RegisterPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErrorMessage(null)
    setSubmitting(true)
    const { error } = await signUp(email.trim(), password)
    setSubmitting(false)
    if (error) {
      setErrorMessage(error.message)
      return
    }
    // メール確認が有効なプロジェクトではセッションがすぐに付かない場合があるためログイン画面へ
    navigate('/login', { replace: true, state: { registered: true } })
  }

  return (
    <div className="page-centered">
      <div className="auth-panel">
        <SupabaseConfigBanner />
        <h1 className="auth-panel__title">会員登録</h1>
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
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? '送信中...' : '登録する'}
          </button>
        </form>
        <p className="auth-panel__footer">
          すでにアカウントをお持ちの方は <Link to="/login">ログイン</Link>
        </p>
      </div>
    </div>
  )
}
