import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Session } from '@supabase/supabase-js'
import { toAuthUserMessage } from '../lib/authErrorMessage'
import { supabase } from '../lib/supabaseClient'
import { AuthContext, type AuthContextValue } from './auth-context'

type AuthProviderProps = {
  children: ReactNode
}

/**
 * Supabase のセッション・ユーザー状態をアプリ全体で共有する
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setSession(null)
      setLoading(false)
      return
    }

    // 初期セッション取得
    void supabase.auth
      .getSession()
      .then(({ data: { session: initial } }) => {
        setSession(initial)
        setLoading(false)
      })
      .catch((e) => {
        console.error('[auth] getSession failed', e)
        setSession(null)
        setLoading(false)
      })

    // ログイン・ログアウト・トークン更新を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) {
      return { error: new Error('Supabase の接続設定がありません。') }
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return {
      error: error ? new Error(toAuthUserMessage(error.message)) : null,
    }
  }, [])

  const signUp = useCallback(async (email: string, password: string) => {
    if (!supabase) {
      return { error: new Error('Supabase の接続設定がありません。') }
    }
    const { error } = await supabase.auth.signUp({ email, password })
    return {
      error: error ? new Error(toAuthUserMessage(error.message)) : null,
    }
  }, [])

  const signOut = useCallback(async () => {
    if (!supabase) return
    await supabase.auth.signOut()
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      loading,
      signIn,
      signUp,
      signOut,
    }),
    [session, loading, signIn, signUp, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
