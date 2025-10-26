#!/usr/bin/env node
/**
 * ダミー/テスト商品を削除するスクリプト
 *
 * 削除対象：
 * - externalImageUrlがない商品
 * - externalImageUrlに"placeholder"や"example.com"が含まれる商品
 * - 名前に「テスト」「ダミー」が含まれる商品
 */

import { createClient } from '@sanity/client';
import readline from 'readline';

const client = createClient({
  projectId: 'fny3jdcg',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function main() {
  console.log('═'.repeat(80));
  console.log('🗑️  ダミー/テスト商品削除スクリプト');
  console.log('═'.repeat(80));
  console.log('');

  // ダミー商品を特定
  const dummyProducts = await client.fetch(`
    *[_type == "product" && (
      !defined(externalImageUrl) ||
      externalImageUrl match "*placeholder*" ||
      externalImageUrl match "*example.com*" ||
      name match "*テスト*" ||
      name match "*ダミー*"
    )] | order(name asc) {
      _id,
      name,
      externalImageUrl,
      _createdAt
    }
  `);

  console.log(`見つかったダミー商品: ${dummyProducts.length}件\n`);

  if (dummyProducts.length === 0) {
    console.log('✅ 削除対象のダミー商品がありません');
    return;
  }

  // サンプル表示
  console.log('削除対象商品（最初の10件）:');
  console.log('─'.repeat(80));
  dummyProducts.slice(0, 10).forEach((p, i) => {
    console.log(`${(i+1).toString().padStart(2)}. ${p.name.substring(0, 60)}`);
    console.log(`    ID: ${p._id}`);
  });
  if (dummyProducts.length > 10) {
    console.log(`    ... 他 ${dummyProducts.length - 10}件`);
  }
  console.log('');

  // 確認プロンプト
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const answer = await new Promise(resolve => {
    rl.question(`⚠️  ${dummyProducts.length}件のダミー商品を削除しますか？ (yes/no): `, resolve);
  });
  rl.close();

  if (answer.toLowerCase() !== 'yes') {
    console.log('\n❌ キャンセルしました');
    return;
  }

  console.log('\n🚀 削除を開始します...\n');

  // 削除実行
  const transaction = client.transaction();
  dummyProducts.forEach(product => {
    transaction.delete(product._id);
  });

  await transaction.commit();

  console.log('═'.repeat(80));
  console.log(`✅ ${dummyProducts.length}件のダミー商品を削除しました`);
  console.log('═'.repeat(80));
  console.log('');

  // 削除後の統計
  const remainingProducts = await client.fetch(`count(*[_type == "product"])`);
  console.log('📊 残りの商品データ:');
  console.log(`   合計: ${remainingProducts}件`);
  console.log('');
}

main().catch(console.error);
