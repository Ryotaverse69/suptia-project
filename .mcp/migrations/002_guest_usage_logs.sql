-- ============================================
-- ゲスト利用ログ マイグレーション v1
-- 作成日: 2026-01-11
--
-- 目的: Cookie識別によるゲストのレート制限
-- 設計思想: 厳密な乱用防止ではなく、ログインへの自然な導線
-- ============================================

-- ============================================
-- 1. ゲスト利用ログテーブル
-- ============================================

CREATE TABLE IF NOT EXISTS guest_usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_session_id TEXT NOT NULL, -- Cookieで発行するセッションID
  action TEXT NOT NULL DEFAULT 'chat', -- 'chat', 'followup'
  usage_date DATE NOT NULL DEFAULT (CURRENT_DATE AT TIME ZONE 'Asia/Tokyo'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- インデックス（レート制限クエリ用）
CREATE INDEX idx_guest_usage_session_date
  ON guest_usage_logs(guest_session_id, usage_date);

-- 古いログの自動削除（7日以上前）
CREATE INDEX idx_guest_usage_created_at
  ON guest_usage_logs(created_at);

-- RLS無効（匿名アクセス可能にする）
-- 注意: このテーブルはサービスロール経由でのみアクセス

-- ============================================
-- 2. 古いゲストログのクリーンアップ関数
-- ============================================

CREATE OR REPLACE FUNCTION cleanup_old_guest_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM guest_usage_logs
  WHERE created_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 完了メッセージ
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ ゲスト利用ログテーブルのセットアップが完了しました！';
  RAISE NOTICE '';
  RAISE NOTICE '📊 作成されたテーブル:';
  RAISE NOTICE '   - guest_usage_logs - ゲスト利用ログ（レート制限用）';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️ 注意: 定期的に cleanup_old_guest_logs() を実行してください';
END $$;
