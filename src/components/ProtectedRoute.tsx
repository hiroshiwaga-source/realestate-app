import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

type ProtectedRouteProps = {
  children: ReactNode
}

/**
 * 未ログイン時はログイン画面へリダイレクト（元のURLは state で保持可能）
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="page-centered">
        <p className="muted">読み込み中...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
