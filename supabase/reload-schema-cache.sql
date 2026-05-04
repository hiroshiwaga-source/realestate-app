-- テーブル作成・変更「後」に PostgREST がまだ古いスキーマを保持しているときに実行する。
-- Supabase SQL Editor でそのまま実行してください。
-- エラー例: Could not find the table 'public.properties' in the schema cache

NOTIFY pgrst, 'reload schema';
