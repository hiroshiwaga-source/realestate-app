import { supabase } from './supabaseClient'
import { toAuthUserMessage } from './authErrorMessage'
import type { Property, PropertyInput, PropertyRow } from '../types/property'

/** DB 行を画面用の型に変換 */
function rowToProperty(row: PropertyRow): Property {
  return {
    id: row.id,
    name: row.name,
    rentYen: row.rent_yen,
    area: row.area,
    layout: row.layout,
    userId: row.user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function toErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err) {
    const m = (err as { message: unknown }).message
    if (typeof m === 'string') return toAuthUserMessage(m)
  }
  return '不明なエラー'
}

const missingClientError =
  'Supabase の接続設定がありません。環境変数を確認してください。'

/** ログインユーザー自身の物件一覧（RLS によりサーバー側でも絞り込み） */
export async function fetchProperties(): Promise<{
  data: Property[] | null
  error: string | null
}> {
  if (!supabase) {
    return { data: null, error: missingClientError }
  }
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return { data: null, error: toErrorMessage(error) }
  }
  const rows = (data ?? []) as PropertyRow[]
  return { data: rows.map(rowToProperty), error: null }
}

/** 物件の新規登録（RLS の WITH CHECK 用に user_id を明示。DEFAULT が効かない環境でも通る） */
export async function createProperty(
  input: PropertyInput,
): Promise<{ data: Property | null; error: string | null }> {
  if (!supabase) {
    return { data: null, error: missingClientError }
  }
  // API リクエストと同じセッションを使う（getUser だけだと JWT とずれることがある）
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError || !session?.user) {
    return {
      data: null,
      error: 'ログイン情報が取得できません。ログアウトしてから再度ログインしてください。',
    }
  }

  const { data, error } = await supabase
    .from('properties')
    .insert({
      name: input.name.trim(),
      rent_yen: input.rentYen,
      area: input.area.trim(),
      layout: input.layout.trim(),
      user_id: session.user.id,
    })
    .select()
    .single()

  if (error) {
    return { data: null, error: toErrorMessage(error) }
  }
  return { data: rowToProperty(data as PropertyRow), error: null }
}

/** 物件の更新（既存行は RLS で本人のみ） */
export async function updateProperty(
  id: string,
  input: PropertyInput,
): Promise<{ data: Property | null; error: string | null }> {
  if (!supabase) {
    return { data: null, error: missingClientError }
  }
  const { data, error } = await supabase
    .from('properties')
    .update({
      name: input.name.trim(),
      rent_yen: input.rentYen,
      area: input.area.trim(),
      layout: input.layout.trim(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { data: null, error: toErrorMessage(error) }
  }
  return { data: rowToProperty(data as PropertyRow), error: null }
}

/** 物件の削除 */
export async function deleteProperty(
  id: string,
): Promise<{ error: string | null }> {
  if (!supabase) {
    return { error: missingClientError }
  }
  const { error } = await supabase.from('properties').delete().eq('id', id)
  if (error) {
    return { error: toErrorMessage(error) }
  }
  return { error: null }
}
