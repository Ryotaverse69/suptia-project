-- ============================================
-- セキュリティ修正 マイグレーション
-- 作成日: 2026-01-14
--
-- 対象:
--   1. SECURITY DEFINER View 警告（3件）
--   2. RLS無効テーブル警告（1件）
-- ============================================

-- ============================================
-- 1. ビューのセキュリティ修正
-- ============================================
-- PostgreSQL 15以降: security_invoker オプションで
-- ビューを呼び出したユーザーの権限で実行されるようにする

-- daily_usage_stats: ユーザーIDを含むため特に重要
ALTER VIEW daily_usage_stats SET (security_invoker = on);

-- quality_metrics: 集計データだが念のため
ALTER VIEW quality_metrics SET (security_invoker = on);

-- trust_metrics: 集計データだが念のため
ALTER VIEW trust_metrics SET (security_invoker = on);

-- ============================================
-- 2. ビューへのアクセス制限（追加対策）
-- ============================================
-- これらは管理用ビューなので、一般ユーザーからのアクセスを制限

-- anon ロール（未認証）からのアクセスを削除
REVOKE SELECT ON daily_usage_stats FROM anon;
REVOKE SELECT ON quality_metrics FROM anon;
REVOKE SELECT ON trust_metrics FROM anon;

-- authenticated ロール（認証済み）からのアクセスも削除
-- これらのビューは管理者ダッシュボード専用
REVOKE SELECT ON daily_usage_stats FROM authenticated;
REVOKE SELECT ON quality_metrics FROM authenticated;
REVOKE SELECT ON trust_metrics FROM authenticated;

-- ============================================
-- 3. guest_usage_logs のRLS有効化
-- ============================================
-- RLSを有効化し、Service Roleのみアクセス可能にする

ALTER TABLE guest_usage_logs ENABLE ROW LEVEL SECURITY;

-- Service Role のみ全操作可能
CREATE POLICY "Service role can manage guest logs"
  ON guest_usage_logs
  FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- 完了メッセージ
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ セキュリティ修正が完了しました！';
  RAISE NOTICE '';
  RAISE NOTICE '🔐 修正内容:';
  RAISE NOTICE '   1. daily_usage_stats - security_invoker = on';
  RAISE NOTICE '   2. quality_metrics - security_invoker = on';
  RAISE NOTICE '   3. trust_metrics - security_invoker = on';
  RAISE NOTICE '   4. 3つのビューへのanon/authenticatedアクセスを削除';
  RAISE NOTICE '   5. guest_usage_logs - RLS有効化 + Service Role限定';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Supabase Security Advisorを再確認してください';
END $$;
