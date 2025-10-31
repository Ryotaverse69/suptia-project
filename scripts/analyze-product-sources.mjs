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

// 全商品を取得
const query = `*[_type == "product"] {
  _id,
  name,
  source,
  priceJPY
}`;

const products = await client.fetch(query);

// Source別に集計
const stats = {
  rakuten: 0,
  yahoo: 0,
  amazon: 0,
  iherb: 0,
  manual: 0,
  null: 0,
};

products.forEach((product) => {
  if (!product.source) {
    stats.null++;
  } else if (product.source === 'rakuten') {
    stats.rakuten++;
  } else if (product.source === 'yahoo') {
    stats.yahoo++;
  } else if (product.source === 'amazon') {
    stats.amazon++;
  } else if (product.source === 'iherb') {
    stats.iherb++;
  } else if (product.source === 'manual') {
    stats.manual++;
  }
});

console.log('📊 商品の内訳（source別）:\n');
console.log(`総商品数: ${products.length}件\n`);
console.log('Source別:');
console.log(`  楽天市場 (rakuten): ${stats.rakuten}件`);
console.log(`  Yahoo!ショッピング (yahoo): ${stats.yahoo}件`);
console.log(`  Amazon (amazon): ${stats.amazon}件`);
console.log(`  iHerb (iherb): ${stats.iherb}件`);
console.log(`  手動登録 (manual): ${stats.manual}件`);
console.log(`  Sourceなし (null): ${stats.null}件`);
console.log('');

// Sourceがない商品の例
const noSourceProducts = products.filter((p) => !p.source).slice(0, 10);

if (noSourceProducts.length > 0) {
  console.log('🔍 Sourceがない商品の例（最初の10件）:\n');
  noSourceProducts.forEach((product, index) => {
    console.log(
      `${index + 1}. ${product.name?.substring(0, 60) || '名前なし'}...`,
    );
    console.log(`   ID: ${product._id}`);

    // IDからsourceを推測
    if (product._id.includes('rakuten')) {
      console.log(`   推測されるSource: 楽天市場`);
    } else if (product._id.includes('yahoo')) {
      console.log(`   推測されるSource: Yahoo!ショッピング`);
    } else if (product._id.includes('amazon')) {
      console.log(`   推測されるSource: Amazon`);
    } else if (product._id.includes('iherb')) {
      console.log(`   推測されるSource: iHerb`);
    }

    console.log('');
  });

  console.log('='.repeat(80));
  console.log(`⚠️  問題: ${stats.null}件の商品にsourceフィールドがありません`);
  console.log('   これらの商品は購入先フィルター機能で絞り込めません\n');

  console.log('💡 解決策:');
  console.log('   商品IDから推測してsourceフィールドを追加するスクリプトを実行');
  console.log('   → node scripts/add-missing-source-fields.mjs\n');
}
