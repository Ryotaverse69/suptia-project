-- カスタム重み付け機能用のカラム追加
-- Pro+Safety / Admin限定機能

-- user_profilesテーブルにcustom_weightsカラムを追加
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS custom_weights JSONB DEFAULT NULL;

-- custom_weightsカラムにコメントを追加
COMMENT ON COLUMN user_profiles.custom_weights IS 'ユーザーのカスタム重み付け設定（Pro+Safety/Admin限定）。形式: {"price": 20, "amount": 20, "costPerformance": 20, "evidence": 20, "safety": 20}';

-- インデックスを追加（JSONBカラムの検索を高速化）
CREATE INDEX IF NOT EXISTS idx_user_profiles_custom_weights
ON user_profiles USING GIN (custom_weights);

-- RLS（Row Level Security）ポリシーの確認
-- user_profilesテーブルに既存のRLSポリシーがある場合、custom_weightsへのアクセスも許可されるはず

-- サンプルクエリ（テスト用）
-- カスタム重み付けを持つユーザーを検索
-- SELECT user_id, plan, custom_weights FROM user_profiles WHERE custom_weights IS NOT NULL;

-- カスタム重み付けをリセット
-- UPDATE user_profiles SET custom_weights = NULL WHERE user_id = 'user-id-here';
