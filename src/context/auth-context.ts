import { createContext } from 'react'
import type { Session, User } from '@supabase/supabase-js'

/** 認証コンテキストの値の型 */
export type AuthContextValue = {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
}

/** 認証状態共有用コンテキスト（Provider と useAuth で使用） */
export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
