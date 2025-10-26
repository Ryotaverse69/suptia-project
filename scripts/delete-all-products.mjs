#!/usr/bin/env node
/**
 * Sanityの全商品（product）を削除するスクリプト
 *
 * ⚠️ 警告: このスクリプトは全ての商品データを削除します！
 *
 * 使用方法:
 * node scripts/delete-all-products.mjs
 */

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'fny3jdcg',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function deleteAllProducts() {
  console.log('\n🗑️  商品（product）ドキュメントを削除中...');

  const products = await client.fetch(`*[_type == "product"]{_id}`);
  console.log(`   見つかった商品数: ${products.length}件`);

  if (products.length === 0) {
    console.log('   ✓ 削除する商品がありません');
    return 0;
  }

  const transaction = client.transaction();
  products.forEach(doc => transaction.delete(doc._id));

  await transaction.commit();
  console.log(`   ✅ ${products.length}件の商品を削除しました`);

  return products.length;
}

async function main() {
  console.log('═'.repeat(60));
  console.log('🗑️  Sanity 商品データ削除スクリプト');
  console.log('═'.repeat(60));
  console.log('');
  console.log('このスクリプトは全ての商品（product）を削除します。');
  console.log('※ 成分、ブランド、その他のデータは削除されません');
  console.log('');
  console.log('⚠️  この操作は取り消せません！');
  console.log('');

  // 実行確認
  const readline = await import('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const answer = await new Promise(resolve => {
    rl.question('続行しますか？ (yes/no): ', resolve);
  });
  rl.close();

  if (answer.toLowerCase() !== 'yes') {
    console.log('\n❌ キャンセルしました');
    process.exit(0);
  }

  console.log('\n🚀 削除を開始します...\n');

  try {
    const deletedCount = await deleteAllProducts();

    console.log('\n' + '═'.repeat(60));
    console.log('✅ 商品データの削除が完了しました');
    console.log('═'.repeat(60));
    console.log(`削除件数: ${deletedCount}件`);
    console.log('');
    console.log('次のステップ:');
    console.log('  1. node scripts/sync-rakuten-products.mjs を実行');
    console.log('  2. node scripts/sync-yahoo-products.mjs を実行');
    console.log('');

  } catch (error) {
    console.error('\n❌ エラーが発生しました:', error.message);
    process.exit(1);
  }
}

main();
