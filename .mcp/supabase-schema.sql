-- Suptia Supabaseデータベーススキーマ
-- このSQLを Supabase SQL Editor で実行してテーブルを作成

-- UUID拡張を有効化
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. ユーザープロファイルテーブル
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  allergies TEXT[], -- アレルギー情報（例: ['soy', 'dairy', 'gluten']）
  health_goals TEXT[], -- 健康目標（例: ['better_sleep', 'immune_boost', 'skin_health']）
  concerns TEXT[], -- 懸念事項（例: ['pregnant', 'medication', 'high_blood_pressure']）
  age_range TEXT, -- 年齢層（例: '20-29', '30-39'）
  gender TEXT, -- 性別（optional）
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Row Level Security (RLS) 有効化
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLSポリシー: ユーザーは自分のプロファイルのみ閲覧・編集可能
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- インデックス
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

-- 更新日時の自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 2. 価格アラートテーブル
-- ============================================
CREATE TABLE IF NOT EXISTS price_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL, -- Sanity商品ID
  product_name TEXT, -- 商品名（キャッシュ）
  target_price DECIMAL(10, 2) NOT NULL, -- 目標価格
  current_price DECIMAL(10, 2), -- 現在価格（最終更新時）
  is_active BOOLEAN DEFAULT TRUE,
  notified_at TIMESTAMP WITH TIME ZONE, -- 最後に通知した日時
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS有効化
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own alerts"
  ON price_alerts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own alerts"
  ON price_alerts FOR ALL
  USING (auth.uid() = user_id);

-- インデックス
CREATE INDEX idx_price_alerts_user ON price_alerts(user_id);
CREATE INDEX idx_price_alerts_active ON price_alerts(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_price_alerts_product ON price_alerts(product_id);

-- 更新日時の自動更新トリガー
CREATE TRIGGER update_price_alerts_updated_at
  BEFORE UPDATE ON price_alerts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 3. お気に入り商品テーブル
-- ============================================
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL, -- Sanity商品ID
  product_name TEXT, -- 商品名（キャッシュ）
  product_image_url TEXT, -- 商品画像URL（キャッシュ）
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- RLS有効化
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own favorites"
  ON favorites FOR ALL
  USING (auth.uid() = user_id);

-- インデックス
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_product ON favorites(product_id);
CREATE INDEX idx_favorites_added_at ON favorites(added_at DESC);

-- ============================================
-- 4. 価格履歴テーブル（Sanityの補完）
-- ============================================
CREATE TABLE IF NOT EXISTS price_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id TEXT NOT NULL, -- Sanity商品ID
  source TEXT NOT NULL, -- rakuten, yahoo, amazon, iherb
  store_name TEXT, -- 店舗名（例: ツルハドラッグ）
  price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER DEFAULT 1, -- セット数量
  unit_price DECIMAL(10, 2), -- 単位価格
  in_stock BOOLEAN DEFAULT TRUE,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- パーティショニング用のインデックス（時系列データ最適化）
CREATE INDEX idx_price_history_product_time ON price_history(product_id, recorded_at DESC);
CREATE INDEX idx_price_history_source ON price_history(source);
CREATE INDEX idx_price_history_recorded_at ON price_history(recorded_at DESC);

-- 月別パーティショニング（オプション、大量データの場合）
-- CREATE TABLE price_history_2025_11 PARTITION OF price_history
--   FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');

-- ============================================
-- 5. 診断結果テーブル
-- ============================================
CREATE TABLE IF NOT EXISTS diagnosis_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  goals TEXT[], -- 目的（例: ['better_sleep', 'immune_boost']）
  concerns TEXT[], -- 懸念（例: ['pregnant', 'medication']）
  recommended_products JSONB, -- 推薦商品リスト
  scores JSONB, -- 各商品のスコア詳細
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS有効化
ALTER TABLE diagnosis_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own diagnosis results"
  ON diagnosis_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own diagnosis results"
  ON diagnosis_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- インデックス
CREATE INDEX idx_diagnosis_results_user ON diagnosis_results(user_id);
CREATE INDEX idx_diagnosis_results_created_at ON diagnosis_results(created_at DESC);
CREATE INDEX idx_diagnosis_results_goals ON diagnosis_results USING GIN(goals);

-- ============================================
-- 6. 商品閲覧履歴テーブル（分析用）
-- ============================================
CREATE TABLE IF NOT EXISTS product_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS有効化
ALTER TABLE product_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own product views"
  ON product_views FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own product views"
  ON product_views FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- インデックス
CREATE INDEX idx_product_views_user ON product_views(user_id);
CREATE INDEX idx_product_views_product ON product_views(product_id);
CREATE INDEX idx_product_views_viewed_at ON product_views(viewed_at DESC);

-- ============================================
-- 7. ユーティリティビュー
-- ============================================

-- アクティブな価格アラート一覧（通知対象）
CREATE OR REPLACE VIEW active_price_alerts AS
SELECT
  pa.*,
  up.allergies,
  up.concerns
FROM price_alerts pa
LEFT JOIN user_profiles up ON pa.user_id = up.user_id
WHERE pa.is_active = TRUE;

-- ユーザー別お気に入り商品数
CREATE OR REPLACE VIEW user_favorites_count AS
SELECT
  user_id,
  COUNT(*) as favorites_count,
  MAX(added_at) as last_added_at
FROM favorites
GROUP BY user_id;

-- 商品別価格推移（7日間平均）
CREATE OR REPLACE VIEW product_price_trends AS
SELECT
  product_id,
  source,
  AVG(unit_price) as avg_unit_price,
  MIN(unit_price) as min_unit_price,
  MAX(unit_price) as max_unit_price,
  COUNT(*) as data_points
FROM price_history
WHERE recorded_at > NOW() - INTERVAL '7 days'
GROUP BY product_id, source;

-- ============================================
-- 8. 初期データ挿入（テスト用）
-- ============================================

-- テストユーザーのプロファイル作成（開発環境のみ）
-- INSERT INTO user_profiles (user_id, allergies, health_goals, concerns)
-- VALUES (
--   'test-user-uuid',
--   ARRAY['soy', 'dairy'],
--   ARRAY['better_sleep', 'immune_boost'],
--   ARRAY[]
-- );

-- ============================================
-- セットアップ完了
-- ============================================

-- テーブル一覧を表示
SELECT
  table_name,
  pg_size_pretty(pg_total_relation_size(quote_ident(table_name))) as size
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 成功メッセージ
DO $$
BEGIN
  RAISE NOTICE '✅ Suptia データベーススキーマのセットアップが完了しました！';
  RAISE NOTICE '📊 作成されたテーブル:';
  RAISE NOTICE '   1. user_profiles - ユーザープロファイル';
  RAISE NOTICE '   2. price_alerts - 価格アラート';
  RAISE NOTICE '   3. favorites - お気に入り商品';
  RAISE NOTICE '   4. price_history - 価格履歴';
  RAISE NOTICE '   5. diagnosis_results - 診断結果';
  RAISE NOTICE '   6. product_views - 商品閲覧履歴';
  RAISE NOTICE '';
  RAISE NOTICE '🔐 Row Level Security (RLS) が有効化されています';
  RAISE NOTICE '📈 インデックスとトリガーが設定されています';
  RAISE NOTICE '';
  RAISE NOTICE '次のステップ:';
  RAISE NOTICE '1. Claude Desktop の設定ファイルにSupabase MCPを追加';
  RAISE NOTICE '2. Claude Desktopを再起動';
  RAISE NOTICE '3. 「Supabaseのテーブル一覧を表示して」と質問して動作確認';
END $$;
