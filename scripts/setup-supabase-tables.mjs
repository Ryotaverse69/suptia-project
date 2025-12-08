/**
 * Supabase テーブルセットアップスクリプト
 *
 * 使用方法: node scripts/setup-supabase-tables.mjs
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env.local を読み込む
dotenv.config({ path: join(__dirname, '../apps/web/.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ 環境変数が設定されていません:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const sql = `
-- お気に入りテーブル
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, product_id)
);

-- 診断履歴テーブル
CREATE TABLE IF NOT EXISTS diagnosis_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  diagnosis_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- RLS (Row Level Security) を有効化
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnosis_history ENABLE ROW LEVEL SECURITY;

-- 既存のポリシーを削除（エラー防止）
DROP POLICY IF EXISTS "Users can view own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can insert own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can delete own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can view own diagnosis history" ON diagnosis_history;
DROP POLICY IF EXISTS "Users can insert own diagnosis history" ON diagnosis_history;

-- 自分のデータのみ閲覧・操作可能なポリシー
CREATE POLICY "Users can view own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own diagnosis history" ON diagnosis_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own diagnosis history" ON diagnosis_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_diagnosis_history_user_id ON diagnosis_history(user_id);
CREATE INDEX IF NOT EXISTS idx_diagnosis_history_created_at ON diagnosis_history(created_at DESC);
`;

async function setup() {
  console.log('🚀 Supabase テーブルをセットアップ中...\n');

  try {
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      // exec_sql RPC が存在しない場合、個別にテーブル確認
      console.log('ℹ️  RPC経由での実行ができないため、REST APIでテーブルを確認します...\n');

      // テーブルが存在するか確認
      const { data: favData, error: favError } = await supabase
        .from('favorites')
        .select('id')
        .limit(1);

      if (favError && favError.code === '42P01') {
        console.log('❌ favoritesテーブルが存在しません。');
        console.log('   Supabaseダッシュボードで以下のSQLを実行してください:\n');
        console.log(sql);
        process.exit(1);
      }

      const { data: diagData, error: diagError } = await supabase
        .from('diagnosis_history')
        .select('id')
        .limit(1);

      if (diagError && diagError.code === '42P01') {
        console.log('❌ diagnosis_historyテーブルが存在しません。');
        console.log('   Supabaseダッシュボードで以下のSQLを実行してください:\n');
        console.log(sql);
        process.exit(1);
      }

      console.log('✅ テーブルは既に存在しています！');
    } else {
      console.log('✅ テーブルのセットアップが完了しました！');
    }

    // テーブル確認
    console.log('\n📋 テーブル確認:');

    const { count: favCount } = await supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true });
    console.log(`   favorites: ${favCount ?? 0} 件`);

    const { count: diagCount } = await supabase
      .from('diagnosis_history')
      .select('*', { count: 'exact', head: true });
    console.log(`   diagnosis_history: ${diagCount ?? 0} 件`);

    console.log('\n✨ セットアップ完了！');

  } catch (err) {
    console.error('❌ エラーが発生しました:', err.message);
    process.exit(1);
  }
}

setup();
