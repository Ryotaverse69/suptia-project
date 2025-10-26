#!/usr/bin/env node

/**
 * Sanity APIを使用してテスト商品15件を削除
 */

import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 環境変数読み込み
const envPath = join(__dirname, '../apps/web/.env.local');
const envContent = readFileSync(envPath, 'utf8');
const SANITY_API_TOKEN = envContent.match(/SANITY_API_TOKEN=(.+)/)?.[1]?.trim();

if (!SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN が見つかりません');
  process.exit(1);
}

const client = createClient({
  projectId: 'fny3jdcg',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: SANITY_API_TOKEN,
});

const dummyProductIds = [
  "1587aeaf-b110-4176-9c2b-b7c01319f928",
  "45a1716d-b7a5-4d8b-a93d-606147a02e47",
  "46817020-4d24-49c6-b967-c60b624440ab",
  "4bff1267-736a-4311-bf91-7c945df05ff1",
  "4db3724c-615b-4ec2-be80-99d051ac43d6",
  "59036ca0-0c8c-4d86-a422-da8bbbb7e748",
  "5993a8eb-1c30-4f02-a869-35c20c635ab3",
  "59a33ba2-4fa1-4498-8226-f8e53c8ae601",
  "70cd5aeb-e362-4bc0-ae45-8e8c425523f4",
  "a1ad94e0-1e65-48ce-8071-db6378c3d88b",
  "ac0c9d49-1418-4fc0-9fb5-f9abaebca900",
  "b152abf6-959b-465c-bbf2-46961156a3fc",
  "c14f8b41-f504-47e2-a24d-26688eedcd12",
  "ea3011f0-cec0-481d-b84c-72dcf8e8571d",
  "ff7b754f-3297-45ae-b7c1-13a1ac4f48a3"
];

async function main() {
  console.log('🗑️  テスト商品削除スクリプト（Sanity API版）');
  console.log('═'.repeat(60));
  console.log(`削除対象: ${dummyProductIds.length}件のダミー商品\n`);

  // まず対象商品を確認
  console.log('🔍 削除対象商品を確認中...\n');
  const query = `*[_id in $ids]{_id, name, "createdAt": _createdAt}`;
  const products = await client.fetch(query, { ids: dummyProductIds });

  console.log(`見つかった商品: ${products.length}件`);
  products.forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.name}`);
  });

  if (products.length === 0) {
    console.log('\n✅ 削除対象のダミー商品は既に存在しません');
    return;
  }

  console.log('\n🚀 削除を実行中...');

  // トランザクションで一括削除
  const transaction = client.transaction();
  products.forEach(p => {
    transaction.delete(p._id);
  });

  try {
    await transaction.commit();
    console.log(`\n✅ ${products.length}件の商品を削除しました！`);
    console.log('═'.repeat(60));
    console.log('📊 最終商品数: 約219件（実データのみ）');
    console.log('  - 楽天: 120件');
    console.log('  - Yahoo!: 95件');
    console.log('  - その他（URL付き）: 4件');
  } catch (error) {
    console.error('\n❌ 削除エラー:', error.message);
    console.log('\nエラー詳細:');
    console.log('  ステータスコード:', error.statusCode);
    console.log('  エラータイプ:', error.type);

    if (error.statusCode === 403) {
      console.log('\n💡 解決方法:');
      console.log('  1. https://sanity.io/manage にアクセス');
      console.log('  2. プロジェクト「suptia-project」を選択');
      console.log('  3. 「API」→「Tokens」タブ');
      console.log('  4. 現在のトークンの権限を「Editor」に変更');
      console.log('\n  または、Sanity Studioで手動削除:');
      console.log('  https://suptia.sanity.studio');
    }
  }
}

main();
