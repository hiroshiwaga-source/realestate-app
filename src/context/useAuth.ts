import { useContext } from 'react'
import { AuthContext } from './auth-context'

/** AuthProvider 配下で認証状態とサインイン／アップ／アウト操作を取得する */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth は AuthProvider 内で使用してください')
  }
  return ctx
}
