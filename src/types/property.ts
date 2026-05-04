/** Supabase public.properties 行（API 応答） */
export type PropertyRow = {
  id: string
  name: string
  rent_yen: number
  area: string
  layout: string
  user_id: string
  created_at: string
  updated_at: string
}

/** 画面・フォーム用の物件型 */
export type Property = {
  id: string
  name: string
  rentYen: number
  area: string
  layout: string
  userId: string
  createdAt: string
  updatedAt: string
}

/** 新規・編集フォームで送る入力値 */
export type PropertyInput = {
  name: string
  rentYen: number
  area: string
  layout: string
}
