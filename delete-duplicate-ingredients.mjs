#!/usr/bin/env node

/**
 * Sanity成分データベースの重複削除スクリプト
 *
 * 削除対象:
 * - カリウム: 5v8OuqFn5O4X8PYE5dNHcE
 * - グルコサミン: P1Z7m8fgwpF7BuhejyHKwp
 * - ナイアシン（ビタミンB3）: pRlcpvz6Xc5z2Mc0MBzKvk
 * - ビタミンA（レチノール）: pRlcpvz6Xc5z2Mc0MBzKZo
 * - ビタミンB12（コバラミン）: 7MAYpyO4GR94MtR0V9EtND
 * - ビタミンK: 7MAYpyO4GR94MtR0V9EtGp
 * - ヨウ素: 5v8OuqFn5O4X8PYE5dNHii
 * - ルテイン: P1Z7m8fgwpF7BuhejyHKyQ
 */

import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';

// 環境変数の読み込み（.env.localから）
const envPath = 'apps/web/.env.local';
let projectId, dataset, token;

try {
  const envContent = readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    if (line.startsWith('NEXT_PUBLIC_SANITY_PROJECT_ID=')) {
      projectId = line.split('=')[1].trim();
    } else if (line.startsWith('NEXT_PUBLIC_SANITY_DATASET=')) {
      dataset = line.split('=')[1].trim();
    } else if (line.startsWith('SANITY_API_TOKEN=')) {
      token = line.split('=')[1].trim();
    }
  });
} catch (err) {
  console.error('❌ .env.localが読み込めません:', err.message);
  process.exit(1);
}

if (!projectId || !token) {
  console.error('❌ 必要な環境変数が設定されていません');
  console.error('  NEXT_PUBLIC_SANITY_PROJECT_ID:', projectId ? '✅' : '❌');
  console.error('  SANITY_API_TOKEN:', token ? '✅' : '❌');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset: dataset || 'production',
  token,
  apiVersion: '2024-01-01',
  useCdn: false,
});

// 削除対象ID
const duplicateIds = [
  "5v8OuqFn5O4X8PYE5dNHcE",   // カリウム
  "P1Z7m8fgwpF7BuhejyHKwp",   // グルコサミン
  "pRlcpvz6Xc5z2Mc0MBzKvk",   // ナイアシン（ビタミンB3）
  "pRlcpvz6Xc5z2Mc0MBzKZo",   // ビタミンA（レチノール）
  "7MAYpyO4GR94MtR0V9EtND",   // ビタミンB12（コバラミン）
  "7MAYpyO4GR94MtR0V9EtGp",   // ビタミンK
  "5v8OuqFn5O4X8PYE5dNHii",   // ヨウ素
  "P1Z7m8fgwpF7BuhejyHKyQ",   // ルテイン
];

async function main() {
  console.log('🗑️  Sanity成分データベース重複削除スクリプト\n');
  console.log(`削除対象: ${duplicateIds.length}件\n`);

  // 確認
  console.log('削除対象のドキュメント:');
  for (const id of duplicateIds) {
    try {
      const doc = await client.getDocument(id);
      console.log(`  - ${doc.name} (${doc.nameEn}) [${id}]`);
    } catch (err) {
      console.log(`  - [${id}] ⚠️  ドキュメントが見つかりません`);
    }
  }

  console.log('\n⚠️  このスクリプトは実際の削除を行います。');
  console.log('⚠️  実行前に必ずバックアップを取得してください。');
  console.log('\n続行するには --confirm フラグを付けて実行してください:');
  console.log('  node delete-duplicate-ingredients.mjs --confirm\n');

  // --confirmフラグのチェック
  if (!process.argv.includes('--confirm')) {
    console.log('❌ 削除はキャンセルされました（--confirmフラグなし）');
    process.exit(0);
  }

  console.log('\n🚀 削除を開始します...\n');

  // 削除実行
  let successCount = 0;
  let failCount = 0;

  for (const id of duplicateIds) {
    try {
      await client.delete(id);
      console.log(`✅ 削除成功: ${id}`);
      successCount++;
    } catch (err) {
      console.error(`❌ 削除失敗: ${id}`, err.message);
      failCount++;
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log(`\n✅ 成功: ${successCount}件`);
  console.log(`❌ 失敗: ${failCount}件`);
  console.log(`\n🎉 削除処理が完了しました！\n`);

  // 最終確認
  console.log('📊 最終確認: 残りの成分数を確認中...\n');
  const allIngredients = await client.fetch('*[_type == "ingredient"] | order(name asc) {_id, name, nameEn}');
  console.log(`総成分数: ${allIngredients.length}件\n`);

  // 重複チェック
  const nameMap = new Map();
  allIngredients.forEach(item => {
    if (!nameMap.has(item.name)) {
      nameMap.set(item.name, []);
    }
    nameMap.get(item.name).push(item);
  });

  const remainingDuplicates = Array.from(nameMap.entries())
    .filter(([_, items]) => items.length > 1);

  if (remainingDuplicates.length > 0) {
    console.log(`⚠️  まだ重複が残っています: ${remainingDuplicates.length}種類`);
    remainingDuplicates.forEach(([name, items]) => {
      console.log(`  - ${name} (${items.length}件)`);
    });
  } else {
    console.log('✅ 重複はすべて解消されました！');
  }
}

main().catch(err => {
  console.error('❌ エラー:', err);
  process.exit(1);
});
