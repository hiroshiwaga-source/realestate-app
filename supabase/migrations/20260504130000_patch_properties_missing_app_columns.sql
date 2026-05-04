-- アプリ必須カラムの欠損パッチ（fix-properties-schema-for-app.sql と同内容）
-- エラー例: Could not find the 'name' column of 'properties' in the schema cache

ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS name text;
UPDATE public.properties SET name = '（名称未設定）' WHERE name IS NULL;
ALTER TABLE public.properties ALTER COLUMN name SET DEFAULT '（名称未設定）';
ALTER TABLE public.properties ALTER COLUMN name SET NOT NULL;

ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS rent_yen integer;
UPDATE public.properties SET rent_yen = 0 WHERE rent_yen IS NULL;
ALTER TABLE public.properties ALTER COLUMN rent_yen SET DEFAULT 0;
ALTER TABLE public.properties ALTER COLUMN rent_yen SET NOT NULL;

ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS area text;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS layout text;
UPDATE public.properties SET area = COALESCE(area, '') WHERE area IS NULL;
UPDATE public.properties SET layout = COALESCE(layout, '') WHERE layout IS NULL;
ALTER TABLE public.properties ALTER COLUMN area SET DEFAULT '';
ALTER TABLE public.properties ALTER COLUMN layout SET DEFAULT '';
ALTER TABLE public.properties ALTER COLUMN area SET NOT NULL;
ALTER TABLE public.properties ALTER COLUMN layout SET NOT NULL;

ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users (id) ON DELETE CASCADE;
ALTER TABLE public.properties ALTER COLUMN user_id SET DEFAULT (auth.uid());

ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS created_at timestamptz;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS updated_at timestamptz;
UPDATE public.properties SET created_at = COALESCE(created_at, now()) WHERE created_at IS NULL;
UPDATE public.properties SET updated_at = COALESCE(updated_at, now()) WHERE updated_at IS NULL;
ALTER TABLE public.properties ALTER COLUMN created_at SET DEFAULT now();
ALTER TABLE public.properties ALTER COLUMN updated_at SET DEFAULT now();
ALTER TABLE public.properties ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE public.properties ALTER COLUMN updated_at SET NOT NULL;

NOTIFY pgrst, 'reload schema';
