-- 不動産管理アプリ：物件テーブルと RLS（自分の物件のみ CRUD 可能）
-- Supabase SQL Editor または supabase db push で適用してください。

-- 物件テーブル
CREATE TABLE IF NOT EXISTS public.properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  rent_yen integer NOT NULL CHECK (rent_yen >= 0),
  area text NOT NULL,
  layout text NOT NULL,
  -- ログイン中ユーザーを自動で紐づけ（クライアントから user_id を送らなくてよい）
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.properties IS '物件マスタ（登録者は user_id）';
COMMENT ON COLUMN public.properties.layout IS '間取り（例: 1LDK）';

-- updated_at 自動更新
CREATE OR REPLACE FUNCTION public.handle_properties_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_properties_updated_at ON public.properties;
CREATE TRIGGER trg_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_properties_updated_at();

CREATE INDEX IF NOT EXISTS idx_properties_user_id ON public.properties (user_id);

-- RLS
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- 既存ポリシーがある場合は削除（再実行用）
DROP POLICY IF EXISTS "properties_select_own" ON public.properties;
DROP POLICY IF EXISTS "properties_insert_own" ON public.properties;
DROP POLICY IF EXISTS "properties_update_own" ON public.properties;
DROP POLICY IF EXISTS "properties_delete_own" ON public.properties;

-- 認証ユーザーのみ：自分の user_id の行だけ参照できる
CREATE POLICY "properties_select_own"
  ON public.properties
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- 新規登録：自分の user_id の行だけ挿入 allowed（DEFAULT auth.uid() と一致）
CREATE POLICY "properties_insert_own"
  ON public.properties
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- 更新：自分の物件のみ
CREATE POLICY "properties_update_own"
  ON public.properties
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 削除：自分の物件のみ
CREATE POLICY "properties_delete_own"
  ON public.properties
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- API ロールへ権限付与（Supabase の慣例）
GRANT SELECT, INSERT, UPDATE, DELETE ON public.properties TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.properties TO service_role;

-- PostgREST のスキーマキャッシュを更新する（無いと「schema cache にテーブルが無い」エラーになりやすい）
NOTIFY pgrst, 'reload schema';
