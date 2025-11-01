#!/usr/bin/env node

import { createClient } from '@sanity/client';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(__dirname, '../apps/web/.env.local');
const envContent = readFileSync(envPath, 'utf8');

const SANITY_PROJECT_ID = envContent
  .match(/NEXT_PUBLIC_SANITY_PROJECT_ID=(.+)/)?.[1]
  ?.trim();
const SANITY_DATASET = envContent
  .match(/NEXT_PUBLIC_SANITY_DATASET=(.+)/)?.[1]
  ?.trim();
const SANITY_API_TOKEN = envContent
  .match(/SANITY_API_TOKEN=(.+)/)?.[1]
  ?.trim();

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  token: SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

console.log('🔍 同じJANコードの重複商品をマージ中...\n');

// JANコードを持つ全商品を取得
const query = `*[_type == "product" && defined(janCode) && janCode != null && janCode != ""] {
  _id,
  janCode,
  name,
  source,
  priceJPY,
  affiliateUrl,
  itemCode,
  slug,
  brandName,
  servingsPerContainer,
  servingsPerDay,
  externalImageUrl,
  images,
  description,
  ingredients,
  priceData
} | order(janCode asc, priceJPY asc)`;

const products = await client.fetch(query);

console.log(`📦 JANコード付き商品: ${products.length}件\n`);

// JANコードでグループ化
const janGroups = {};
products.forEach((product) => {
  if (!janGroups[product.janCode]) {
    janGroups[product.janCode] = [];
  }
  janGroups[product.janCode].push(product);
});

// 複数の商品がある（＝重複がある）JANコードを抽出
const duplicateGroups = Object.entries(janGroups).filter(
  ([jan, products]) => products.length > 1
);

console.log(`🎯 重複している商品グループ: ${duplicateGroups.length}件\n`);

if (duplicateGroups.length === 0) {
  console.log('✅ 重複商品はありません');
  process.exit(0);
}

// 削除する商品のバックアップを作成
const backupData = {
  timestamp: new Date().toISOString(),
  duplicateGroups: [],
};

let totalKept = 0;
let totalDeleted = 0;
let totalErrors = 0;

for (const [janCode, groupProducts] of duplicateGroups) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`JANコード: ${janCode}`);
  console.log(`商品名: ${groupProducts[0].name.substring(0, 60)}...`);
  console.log(`重複商品数: ${groupProducts.length}件`);

  // 価格順にソート済み（最安値が最初）
  const representative = groupProducts[0]; // 最安値の商品を代表に選択
  const duplicates = groupProducts.slice(1); // 残りは削除対象

  console.log(`\n💰 価格一覧:`);
  groupProducts.forEach((p, index) => {
    const badge = index === 0 ? '🏆 代表商品（保持）' : '❌ 削除対象';
    console.log(
      `  ${index + 1}. [${p.source}] ¥${p.priceJPY.toLocaleString()} - ${badge}`
    );
    console.log(`     ID: ${p._id}`);
    console.log(`     Slug: ${p.slug.current}`);
  });

  // バックアップに記録
  backupData.duplicateGroups.push({
    janCode,
    representative: {
      _id: representative._id,
      name: representative.name,
      slug: representative.slug.current,
      priceJPY: representative.priceJPY,
    },
    deleted: duplicates.map((p) => ({
      _id: p._id,
      name: p.name,
      slug: p.slug.current,
      priceJPY: p.priceJPY,
      source: p.source,
    })),
  });

  console.log(`\n🔄 重複商品を削除中... (${duplicates.length}件)`);

  for (const duplicate of duplicates) {
    try {
      await client.delete(duplicate._id);
      totalDeleted++;
      console.log(`   ✅ 削除: ${duplicate._id} (¥${duplicate.priceJPY})`);
    } catch (error) {
      console.error(`   ❌ 削除失敗: ${duplicate._id} - ${error.message}`);
      totalErrors++;
    }
  }

  totalKept++;
  console.log(`   ✅ 保持: ${representative._id} (¥${representative.priceJPY})`);
}

// バックアップを保存
const backupPath = join(__dirname, 'deleted-duplicate-products-backup.json');
writeFileSync(backupPath, JSON.stringify(backupData, null, 2), 'utf8');

console.log('\n' + '='.repeat(80));
console.log(`\n✅ マージ完了:`);
console.log(`   保持: ${totalKept}件（代表商品）`);
console.log(`   削除: ${totalDeleted}件（重複商品）`);
if (totalErrors > 0) {
  console.log(`   ❌ エラー: ${totalErrors}件`);
}
console.log('');

console.log(`💾 削除した商品のバックアップ:`);
console.log(`   ${backupPath}\n`);

console.log('💡 確認方法:');
console.log('   1. 商品一覧ページで重複がなくなったことを確認');
console.log('   2. 代表商品の詳細ページで全販売元の価格比較が表示されることを確認');
console.log('');
console.log('📊 統計を再確認:');
console.log('   node scripts/analyze-product-sources.mjs\n');
