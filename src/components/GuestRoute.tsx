import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

type GuestRouteProps = {
  children: ReactNode
}

/**
 * ログイン済みの場合はトップ（物件一覧）へリダイレクト
 */
export function GuestRoute({ children }: GuestRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="page-centered">
        <p className="muted">読み込み中...</p>
      </div>
    )
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
