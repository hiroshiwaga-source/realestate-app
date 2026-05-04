-- ============================================================
-- 「Could not find the 'area' column ... in the schema cache」向け
-- Supabase の SQL Editor に貼り付けてそのまま実行してください。
-- ============================================================

ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS area text;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS layout text;

UPDATE public.properties SET area = COALESCE(area, '') WHERE area IS NULL;
UPDATE public.properties SET layout = COALESCE(layout, '') WHERE layout IS NULL;

ALTER TABLE public.properties ALTER COLUMN area SET DEFAULT '';
ALTER TABLE public.properties ALTER COLUMN layout SET DEFAULT '';
ALTER TABLE public.properties ALTER COLUMN area SET NOT NULL;
ALTER TABLE public.properties ALTER COLUMN layout SET NOT NULL;

NOTIFY pgrst, 'reload schema';
