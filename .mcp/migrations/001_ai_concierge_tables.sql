-- ============================================
-- AIコンシェルジュ マイグレーション v1
-- 作成日: 2025-12-21
--
-- 実行手順:
--   1. Supabase Dashboard > SQL Editor
--   2. このファイルの内容を貼り付けて実行
-- ============================================

-- ============================================
-- 1. ユーザープラン詳細テーブル（Stripe連携用）
-- ============================================
-- 注意: user_profiles.plan は簡易的なプラン判定用
-- このテーブルは課金詳細・有効期限管理用

CREATE TABLE IF NOT EXISTS user_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'pro_safety')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_price_id TEXT,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- RLS有効化
ALTER TABLE user_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own plan" ON user_plans
  FOR SELECT USING (auth.uid() = user_id);

-- サービスロールのみ更新可能（Stripe Webhook経由）
CREATE POLICY "Service role can manage plans" ON user_plans
  FOR ALL USING (auth.role() = 'service_role');

-- インデックス
CREATE INDEX idx_user_plans_user_id ON user_plans(user_id);
CREATE INDEX idx_user_plans_stripe_customer ON user_plans(stripe_customer_id);

-- 更新日時トリガー
CREATE TRIGGER update_user_plans_updated_at
  BEFORE UPDATE ON user_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 2. ユーザーキャラクター設定テーブル
-- ============================================

CREATE TABLE IF NOT EXISTS user_characters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  character_id TEXT NOT NULL DEFAULT 'navi' CHECK (character_id IN ('navi', 'mint', 'doc', 'haru')),
  custom_name TEXT, -- Pro+Safety限定: キャラのカスタム名
  recommendation_style TEXT DEFAULT 'balanced'
    CHECK (recommendation_style IN ('balanced', 'evidence', 'cost', 'safety')),
  change_count INTEGER DEFAULT 0, -- 月間変更回数（Pro: 3回制限）
  last_changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- RLS有効化
ALTER TABLE user_characters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own character" ON user_characters
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own character" ON user_characters
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own character" ON user_characters
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- インデックス
CREATE INDEX idx_user_characters_user_id ON user_characters(user_id);

-- ============================================
-- 3. チャットセッションテーブル
-- ============================================

CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  character_id TEXT NOT NULL DEFAULT 'navi',
  title TEXT, -- セッションのタイトル（最初の質問から自動生成）
  summary TEXT, -- 古いセッションの要約（Pro+Safety用）
  message_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ, -- プラン別の保存期限
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ -- 論理削除
);

-- RLS有効化
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions" ON chat_sessions
  FOR SELECT USING (auth.uid() = user_id AND deleted_at IS NULL);

CREATE POLICY "Users can create own sessions" ON chat_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON chat_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- インデックス
CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_expires_at ON chat_sessions(expires_at);
CREATE INDEX idx_chat_sessions_updated_at ON chat_sessions(updated_at DESC);

-- 更新日時トリガー
CREATE TRIGGER update_chat_sessions_updated_at
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 4. チャットメッセージテーブル
-- ============================================

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  -- metadata構造:
  -- {
  --   characterId?: string,
  --   recommendedProducts?: string[],
  --   sources?: { name: string, url?: string }[],
  --   advisories?: Advisory[],
  --   model?: string,
  --   tokensUsed?: number,
  --   cacheHit?: boolean,
  --   userFeedback?: 'helpful' | 'not_helpful'
  -- }
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS有効化
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in own sessions" ON chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_sessions
      WHERE chat_sessions.id = chat_messages.session_id
      AND chat_sessions.user_id = auth.uid()
      AND chat_sessions.deleted_at IS NULL
    )
  );

CREATE POLICY "Users can create messages in own sessions" ON chat_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_sessions
      WHERE chat_sessions.id = chat_messages.session_id
      AND chat_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own messages" ON chat_messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM chat_sessions
      WHERE chat_sessions.id = chat_messages.session_id
      AND chat_sessions.user_id = auth.uid()
    )
  );

-- インデックス
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);

-- ============================================
-- 5. 利用ログテーブル（レート制限・コスト分析・品質指標）
-- ============================================

CREATE TABLE IF NOT EXISTS usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES chat_sessions(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- 'chat', 'followup', 'safety_check', etc.
  model TEXT, -- 'haiku', 'sonnet', 'opus'
  tokens_input INTEGER,
  tokens_output INTEGER,
  cost_usd DECIMAL(10, 6),
  cache_hit BOOLEAN DEFAULT FALSE,
  -- v2.1: 品質指標用
  user_feedback TEXT CHECK (user_feedback IN ('helpful', 'not_helpful')),
  is_followup_question BOOLEAN DEFAULT FALSE,
  response_time_ms INTEGER, -- レスポンス時間
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS有効化
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own usage logs" ON usage_logs
  FOR SELECT USING (auth.uid() = user_id);

-- サービスロールのみ挿入可能
CREATE POLICY "Service role can insert usage logs" ON usage_logs
  FOR INSERT WITH CHECK (auth.role() = 'service_role' OR auth.uid() = user_id);

-- インデックス
CREATE INDEX idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX idx_usage_logs_created_at ON usage_logs(created_at DESC);
CREATE INDEX idx_usage_logs_user_date ON usage_logs(user_id, created_at);

-- ============================================
-- 6. 注意喚起ログテーブル（信頼性指標用）
-- ============================================

CREATE TABLE IF NOT EXISTS advisory_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES chat_sessions(id) ON DELETE SET NULL,
  message_id UUID REFERENCES chat_messages(id) ON DELETE SET NULL,
  advisory_level TEXT NOT NULL CHECK (advisory_level IN ('low', 'medium', 'high')),
  advisory_type TEXT NOT NULL, -- 'guideline_warning', 'documented_interaction', 'general_caution'
  substance_names TEXT[], -- 関連する成分・薬剤名
  source_layer TEXT NOT NULL CHECK (source_layer IN ('layer1', 'layer2', 'layer3')),
  source_name TEXT NOT NULL, -- 出典名
  source_url TEXT, -- 出典URL
  -- ユーザーアクション追跡（信頼性指標）
  user_action TEXT CHECK (user_action IN ('proceeded', 'alternative_selected', 'saved_for_consultation', 'dismissed')),
  action_recorded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS有効化
ALTER TABLE advisory_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own advisory logs" ON advisory_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own advisory logs" ON advisory_logs
  FOR UPDATE USING (auth.uid() = user_id);

-- サービスロールのみ挿入可能
CREATE POLICY "Service role can insert advisory logs" ON advisory_logs
  FOR INSERT WITH CHECK (auth.role() = 'service_role' OR auth.uid() = user_id);

-- インデックス
CREATE INDEX idx_advisory_logs_user_id ON advisory_logs(user_id);
CREATE INDEX idx_advisory_logs_session_id ON advisory_logs(session_id);
CREATE INDEX idx_advisory_logs_level ON advisory_logs(advisory_level);
CREATE INDEX idx_advisory_logs_created_at ON advisory_logs(created_at DESC);

-- ============================================
-- 7. ビュー: 日別利用状況（レート制限用）
-- ============================================

CREATE OR REPLACE VIEW daily_usage_stats AS
SELECT
  user_id,
  DATE(created_at AT TIME ZONE 'Asia/Tokyo') as usage_date,
  COUNT(*) FILTER (WHERE action = 'chat') as chat_count,
  COUNT(*) FILTER (WHERE action = 'followup') as followup_count,
  SUM(tokens_input + COALESCE(tokens_output, 0)) as total_tokens,
  SUM(cost_usd) as total_cost_usd
FROM usage_logs
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY user_id, DATE(created_at AT TIME ZONE 'Asia/Tokyo');

-- ============================================
-- 8. ビュー: 品質指標サマリー
-- ============================================

CREATE OR REPLACE VIEW quality_metrics AS
SELECT
  DATE(created_at AT TIME ZONE 'Asia/Tokyo') as date,
  COUNT(*) as total_responses,
  COUNT(*) FILTER (WHERE user_feedback = 'helpful') as helpful_count,
  COUNT(*) FILTER (WHERE user_feedback = 'not_helpful') as not_helpful_count,
  ROUND(
    COUNT(*) FILTER (WHERE user_feedback = 'helpful')::DECIMAL /
    NULLIF(COUNT(*) FILTER (WHERE user_feedback IS NOT NULL), 0) * 100,
    2
  ) as helpful_rate,
  COUNT(*) FILTER (WHERE is_followup_question = TRUE) as followup_count,
  AVG(response_time_ms) as avg_response_time_ms
FROM usage_logs
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at AT TIME ZONE 'Asia/Tokyo')
ORDER BY date DESC;

-- ============================================
-- 9. ビュー: 信頼性指標サマリー
-- ============================================

CREATE OR REPLACE VIEW trust_metrics AS
SELECT
  DATE(created_at AT TIME ZONE 'Asia/Tokyo') as date,
  advisory_level,
  COUNT(*) as total_advisories,
  COUNT(*) FILTER (WHERE user_action = 'proceeded') as proceeded_count,
  COUNT(*) FILTER (WHERE user_action = 'alternative_selected') as alternative_count,
  COUNT(*) FILTER (WHERE user_action = 'saved_for_consultation') as consultation_count,
  ROUND(
    COUNT(*) FILTER (WHERE user_action = 'alternative_selected')::DECIMAL /
    NULLIF(COUNT(*) FILTER (WHERE user_action IS NOT NULL), 0) * 100,
    2
  ) as alternative_selection_rate
FROM advisory_logs
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at AT TIME ZONE 'Asia/Tokyo'), advisory_level
ORDER BY date DESC, advisory_level;

-- ============================================
-- 10. 関数: セッション期限設定
-- ============================================

CREATE OR REPLACE FUNCTION set_session_expiry()
RETURNS TRIGGER AS $$
DECLARE
  user_plan TEXT;
BEGIN
  -- ユーザーのプランを取得
  SELECT COALESCE(up.plan, 'free') INTO user_plan
  FROM user_profiles up
  WHERE up.user_id = NEW.user_id;

  -- プラン別の有効期限を設定
  CASE user_plan
    WHEN 'free' THEN
      NEW.expires_at := NOW() + INTERVAL '3 days';
    WHEN 'pro' THEN
      NEW.expires_at := NOW() + INTERVAL '30 days';
    WHEN 'pro_safety' THEN
      NEW.expires_at := NULL; -- 無制限
    ELSE
      NEW.expires_at := NOW() + INTERVAL '3 days';
  END CASE;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_chat_session_expiry
  BEFORE INSERT ON chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION set_session_expiry();

-- ============================================
-- 11. 関数: メッセージ数更新
-- ============================================

CREATE OR REPLACE FUNCTION update_session_message_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE chat_sessions
  SET
    message_count = message_count + 1,
    updated_at = NOW()
  WHERE id = NEW.session_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_message_count
  AFTER INSERT ON chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_session_message_count();

-- ============================================
-- 完了メッセージ
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ AIコンシェルジュ テーブルのセットアップが完了しました！';
  RAISE NOTICE '';
  RAISE NOTICE '📊 作成されたテーブル:';
  RAISE NOTICE '   1. user_plans - ユーザープラン詳細（Stripe連携）';
  RAISE NOTICE '   2. user_characters - キャラクター設定';
  RAISE NOTICE '   3. chat_sessions - チャットセッション';
  RAISE NOTICE '   4. chat_messages - チャットメッセージ';
  RAISE NOTICE '   5. usage_logs - 利用ログ（レート制限・品質指標）';
  RAISE NOTICE '   6. advisory_logs - 注意喚起ログ（信頼性指標）';
  RAISE NOTICE '';
  RAISE NOTICE '📈 作成されたビュー:';
  RAISE NOTICE '   - daily_usage_stats - 日別利用状況';
  RAISE NOTICE '   - quality_metrics - 品質指標サマリー';
  RAISE NOTICE '   - trust_metrics - 信頼性指標サマリー';
  RAISE NOTICE '';
  RAISE NOTICE '🔐 Row Level Security (RLS) が有効化されています';
END $$;
