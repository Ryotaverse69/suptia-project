#!/usr/bin/env node

import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
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

console.log('🔍 Sourceフィールドがない商品を検索中...\n');

// Sourceがない商品を取得
const query = `*[_type == "product" && !defined(source)] {
  _id,
  name
}`;

const products = await client.fetch(query);

console.log(`📦 ${products.length}件の商品にsourceフィールドがありません\n`);

if (products.length === 0) {
  console.log('✅ すべての商品にsourceフィールドが設定されています');
  process.exit(0);
}

const updates = {
  rakuten: [],
  yahoo: [],
  amazon: [],
  iherb: [],
  manual: [],
};

// 商品IDからsourceを推測
products.forEach((product) => {
  let source = null;

  if (product._id.includes('rakuten')) {
    source = 'rakuten';
    updates.rakuten.push(product._id);
  } else if (product._id.includes('yahoo')) {
    source = 'yahoo';
    updates.yahoo.push(product._id);
  } else if (product._id.includes('amazon')) {
    source = 'amazon';
    updates.amazon.push(product._id);
  } else if (product._id.includes('iherb')) {
    source = 'iherb';
    updates.iherb.push(product._id);
  } else {
    source = 'manual';
    updates.manual.push(product._id);
  }

  product.inferredSource = source;
});

console.log('📊 推測されたsource別内訳:\n');
console.log(`  楽天市場: ${updates.rakuten.length}件`);
console.log(`  Yahoo!ショッピング: ${updates.yahoo.length}件`);
console.log(`  Amazon: ${updates.amazon.length}件`);
console.log(`  iHerb: ${updates.iherb.length}件`);
console.log(`  手動登録: ${updates.manual.length}件\n`);

console.log('🔄 商品を更新中...\n');

let successCount = 0;
let errorCount = 0;

// バッチ更新
for (const product of products) {
  try {
    await client.patch(product._id).set({ source: product.inferredSource }).commit();
    successCount++;
    if (successCount % 10 === 0) {
      console.log(`   ✅ ${successCount}/${products.length}件更新完了`);
    }
  } catch (error) {
    console.error(`   ❌ ${product._id} の更新に失敗:`, error.message);
    errorCount++;
  }
}

console.log('\n' + '='.repeat(80));
console.log(`✅ 更新完了: ${successCount}件`);
if (errorCount > 0) {
  console.log(`❌ エラー: ${errorCount}件`);
}
console.log('='.repeat(80) + '\n');

console.log('💡 確認方法:');
console.log('   node scripts/analyze-product-sources.mjs');
console.log('   で最新の統計を確認できます\n');
