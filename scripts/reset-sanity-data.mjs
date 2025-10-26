#!/usr/bin/env node
/**
 * Sanityの全データを削除するスクリプト
 *
 * ⚠️ 警告: このスクリプトは全てのデータを削除します！
 * 実行前に必ずバックアップを取得してください。
 *
 * 使用方法:
 * node scripts/reset-sanity-data.mjs
 */

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'fny3jdcg',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function deleteAllDocuments(docType) {
  console.log(`\n🗑️  ${docType} ドキュメントを削除中...`);

  const docs = await client.fetch(`*[_type == "${docType}"]{_id}`);
  console.log(`   見つかったドキュメント数: ${docs.length}件`);

  if (docs.length === 0) {
    console.log(`   ✓ 削除するドキュメントがありません`);
    return;
  }

  const transaction = client.transaction();
  docs.forEach(doc => transaction.delete(doc._id));

  await transaction.commit();
  console.log(`   ✅ ${docs.length}件のドキュメントを削除しました`);
}

async function main() {
  console.log('═'.repeat(60));
  console.log('⚠️  Sanity データベース完全削除スクリプト');
  console.log('═'.repeat(60));
  console.log('');
  console.log('このスクリプトは以下のデータを削除します:');
  console.log('  • 全成分記事 (ingredient)');
  console.log('  • 全商品 (product)');
  console.log('  • 全ブランド (brand)');
  console.log('  • その他すべてのドキュメント');
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
    // ドキュメントタイプごとに削除
    await deleteAllDocuments('ingredient');
    await deleteAllDocuments('product');
    await deleteAllDocuments('brand');
    await deleteAllDocuments('persona');
    await deleteAllDocuments('evidence');
    await deleteAllDocuments('rule');

    console.log('\n' + '═'.repeat(60));
    console.log('✅ すべてのデータを削除しました');
    console.log('═'.repeat(60));
    console.log('\n次のステップ:');
    console.log('  1. node scripts/clean-ingredient-articles.mjs を実行');
    console.log('  2. npx sanity dataset import [JSONファイル] production を実行');
    console.log('');

  } catch (error) {
    console.error('\n❌ エラーが発生しました:', error.message);
    process.exit(1);
  }
}

main();
