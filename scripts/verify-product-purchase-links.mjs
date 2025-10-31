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

console.log('🔍 全商品の購入リンク状況を確認中...\n');

const query = `*[_type == "product"] {
  _id,
  name,
  source,
  priceJPY,
  priceData
}`;

const products = await client.fetch(query);

console.log(`📦 総商品数: ${products.length}件\n`);

const stats = {
  withPriceData: 0,
  withoutPriceData: 0,
  withPrice: 0,
  withoutPrice: 0,
  withPurchaseLink: 0,
  withoutPurchaseLink: 0,
};

const categories = {
  rakuten: { total: 0, withLink: 0, withoutLink: 0 },
  yahoo: { total: 0, withLink: 0, withoutLink: 0 },
  manual: { total: 0, withLink: 0, withoutLink: 0 },
};

products.forEach((product) => {
  // PriceDataチェック
  if (product.priceData && Array.isArray(product.priceData) && product.priceData.length > 0) {
    stats.withPriceData++;

    // 購入リンクチェック
    const hasValidLink = product.priceData.some(pd => pd.url && pd.url.trim() !== '');
    if (hasValidLink) {
      stats.withPurchaseLink++;
    } else {
      stats.withoutPurchaseLink++;
    }
  } else {
    stats.withoutPriceData++;
    stats.withoutPurchaseLink++;
  }

  // 価格チェック
  if (product.priceJPY && product.priceJPY > 0) {
    stats.withPrice++;
  } else {
    stats.withoutPrice++;
  }

  // Source別カテゴリ
  const source = product.source || 'manual';
  if (categories[source]) {
    categories[source].total++;
    const hasValidLink = product.priceData?.some(pd => pd.url && pd.url.trim() !== '');
    if (hasValidLink) {
      categories[source].withLink++;
    } else {
      categories[source].withoutLink++;
    }
  }
});

console.log('📊 全体統計:\n');
console.log(`  priceDataあり: ${stats.withPriceData}件 (${((stats.withPriceData / products.length) * 100).toFixed(1)}%)`);
console.log(`  priceDataなし: ${stats.withoutPriceData}件 (${((stats.withoutPriceData / products.length) * 100).toFixed(1)}%)`);
console.log('');
console.log(`  価格情報あり: ${stats.withPrice}件 (${((stats.withPrice / products.length) * 100).toFixed(1)}%)`);
console.log(`  価格情報なし: ${stats.withoutPrice}件 (${((stats.withoutPrice / products.length) * 100).toFixed(1)}%)`);
console.log('');
console.log(`  ✅ 購入リンクあり: ${stats.withPurchaseLink}件 (${((stats.withPurchaseLink / products.length) * 100).toFixed(1)}%)`);
console.log(`  ❌ 購入リンクなし: ${stats.withoutPurchaseLink}件 (${((stats.withoutPurchaseLink / products.length) * 100).toFixed(1)}%)`);
console.log('\n' + '='.repeat(80) + '\n');

console.log('📊 購入先別の購入リンク状況:\n');
Object.entries(categories).forEach(([source, data]) => {
  if (data.total > 0) {
    const sourceName = source === 'rakuten' ? '楽天市場' : source === 'yahoo' ? 'Yahoo!ショッピング' : '手動登録';
    console.log(`  ${sourceName}:`);
    console.log(`    総数: ${data.total}件`);
    console.log(`    購入リンクあり: ${data.withLink}件 (${((data.withLink / data.total) * 100).toFixed(1)}%)`);
    console.log(`    購入リンクなし: ${data.withoutLink}件 (${((data.withoutLink / data.total) * 100).toFixed(1)}%)`);
    console.log('');
  }
});

// 購入リンクがない商品の例を表示
const productsWithoutLinks = products.filter(p => {
  if (!p.priceData || !Array.isArray(p.priceData) || p.priceData.length === 0) {
    return true;
  }
  return !p.priceData.some(pd => pd.url && pd.url.trim() !== '');
});

if (productsWithoutLinks.length > 0) {
  console.log('='.repeat(80) + '\n');
  console.log(`⚠️  購入リンクがない商品の例（最初の10件）:\n`);
  productsWithoutLinks.slice(0, 10).forEach((product, index) => {
    console.log(`${index + 1}. ${product.name}`);
    console.log(`   ID: ${product._id}`);
    console.log(`   Source: ${product.source || 'なし'}`);
    console.log(`   priceJPY: ${product.priceJPY || 'なし'}`);
    console.log(`   priceData: ${product.priceData ? `${product.priceData.length}件` : 'なし'}`);
    console.log('');
  });
}

console.log('='.repeat(80) + '\n');
console.log('💡 結論:\n');
if (stats.withPurchaseLink === products.length) {
  console.log('  ✅ 全ての商品に購入リンクがあります！');
} else {
  console.log(`  ⚠️  ${stats.withoutPurchaseLink}件の商品に購入リンクがありません`);
  console.log('  これらの商品は実際には購入できない可能性があります');
}
console.log('');
