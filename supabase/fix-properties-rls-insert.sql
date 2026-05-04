-- ============================================================
-- INSERT 時の RLS 向け / user_id 列が無いとき（42703）もここから
--
-- 必ず「この SQL の本文だけ」を SQL Editor に貼り付けて実行する
-- ============================================================

-- 1) user_id 列が無ければ追加（ここが無いと ALTER COLUMN で 42703 になる）
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users (id) ON DELETE CASCADE;

ALTER TABLE public.properties ALTER COLUMN user_id SET DEFAULT (auth.uid());

-- 2) INSERT ポリシー（既においても作り直し）
DROP POLICY IF EXISTS "properties_insert_own" ON public.properties;

CREATE POLICY "properties_insert_own"
  ON public.properties
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

GRANT INSERT ON public.properties TO authenticated;

NOTIFY pgrst, 'reload schema';
