-- properties に area / layout が無い場合のパッチ（アプリと整合させる）
-- エラー例: Could not find the 'area' column of 'properties' in the schema cache
--
-- 原因:
-- 1) CREATE TABLE IF NOT EXISTS により、古い定義のテーブルが残り area が無い
-- 2) カラム追加後も PostgREST のスキーマキャッシュが古い

ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS area text;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS layout text;

UPDATE public.properties SET area = COALESCE(area, '') WHERE area IS NULL;
UPDATE public.properties SET layout = COALESCE(layout, '') WHERE layout IS NULL;

ALTER TABLE public.properties ALTER COLUMN area SET DEFAULT '';
ALTER TABLE public.properties ALTER COLUMN layout SET DEFAULT '';
ALTER TABLE public.properties ALTER COLUMN area SET NOT NULL;
ALTER TABLE public.properties ALTER COLUMN layout SET NOT NULL;

NOTIFY pgrst, 'reload schema';
