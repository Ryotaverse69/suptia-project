-- ============================================
-- キャラクターアバター マイグレーション
-- 作成日: 2025-12-22
--
-- 実行手順:
--   1. Supabase Dashboard > SQL Editor
--   2. このファイルの内容を貼り付けて実行
-- ============================================

-- ============================================
-- 1. キャラクターアバターテーブル
-- ============================================
-- Admin が生成したアバター画像を全ユーザー共通で使用

CREATE TABLE IF NOT EXISTS character_avatars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  character_id TEXT NOT NULL UNIQUE CHECK (character_id IN ('navi', 'mint', 'doc', 'haru')),
  image_url TEXT NOT NULL, -- Supabase Storage URL
  prompt TEXT, -- 生成時のプロンプト（記録用）
  model TEXT DEFAULT 'gemini-2.0-flash-preview-image-generation',
  generated_by UUID REFERENCES auth.users(id), -- 生成したAdmin
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS有効化
ALTER TABLE character_avatars ENABLE ROW LEVEL SECURITY;

-- 全ユーザーが閲覧可能
CREATE POLICY "Anyone can view character avatars" ON character_avatars
  FOR SELECT USING (true);

-- Admin（サービスロール）のみ更新可能
CREATE POLICY "Service role can manage character avatars" ON character_avatars
  FOR ALL USING (auth.role() = 'service_role');

-- インデックス
CREATE INDEX idx_character_avatars_character_id ON character_avatars(character_id);

-- 更新日時トリガー
CREATE TRIGGER update_character_avatars_updated_at
  BEFORE UPDATE ON character_avatars
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 2. Supabase Storage バケット作成
-- ============================================
-- 注意: これはSQL Editorではなく、Supabase Dashboardの
-- Storage > Create a new bucket で手動作成してください
--
-- バケット名: character-avatars
-- Public: Yes (公開)
-- File size limit: 5MB
-- Allowed MIME types: image/png, image/jpeg, image/webp

-- ============================================
-- 完了メッセージ
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ キャラクターアバター テーブルのセットアップが完了しました！';
  RAISE NOTICE '';
  RAISE NOTICE '📋 次の手順:';
  RAISE NOTICE '   1. Supabase Dashboard > Storage > Create bucket';
  RAISE NOTICE '   2. バケット名: character-avatars';
  RAISE NOTICE '   3. Public: Yes';
  RAISE NOTICE '   4. File size limit: 5MB';
END $$;
