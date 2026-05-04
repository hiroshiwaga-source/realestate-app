-- ============================================================
-- properties の RLS を一通り揃え直す（INSERT で「violates policy」が出るとき）
-- SQL Editor に本文だけ貼り付けて実行（ファイル名は貼らない）
-- ============================================================

-- user_id が無いテーブルでも通る
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users (id) ON DELETE CASCADE;
ALTER TABLE public.properties ALTER COLUMN user_id SET DEFAULT (auth.uid());

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "properties_select_own" ON public.properties;
DROP POLICY IF EXISTS "properties_insert_own" ON public.properties;
DROP POLICY IF EXISTS "properties_update_own" ON public.properties;
DROP POLICY IF EXISTS "properties_delete_own" ON public.properties;

CREATE POLICY "properties_select_own"
  ON public.properties FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "properties_insert_own"
  ON public.properties FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "properties_update_own"
  ON public.properties FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "properties_delete_own"
  ON public.properties FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.properties TO authenticated;

NOTIFY pgrst, 'reload schema';
