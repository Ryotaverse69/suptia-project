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

console.log('🔍 JANコードから価格比較データを生成中...\n');

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
  'brandName': brand->name
} | order(janCode asc)`;

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

// 複数の商品がある（＝価格比較可能な）JANコードを抽出
const comparableGroups = Object.entries(janGroups).filter(
  ([jan, products]) => products.length > 1
);

console.log(`🎯 価格比較可能なグループ: ${comparableGroups.length}件\n`);

if (comparableGroups.length === 0) {
  console.log('⚠️  価格比較可能な商品がありません');
  process.exit(0);
}

let totalUpdated = 0;
let totalErrors = 0;

// 各グループを処理
for (const [janCode, groupProducts] of comparableGroups) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`JANコード: ${janCode}`);
  console.log(`商品名: ${groupProducts[0].name.substring(0, 60)}...`);
  console.log(`商品数: ${groupProducts.length}件`);

  // ECサイト別の内訳
  const sourceCounts = {};
  groupProducts.forEach((p) => {
    sourceCounts[p.source] = (sourceCounts[p.source] || 0) + 1;
  });
  console.log(
    `ECサイト別: ${Object.entries(sourceCounts)
      .map(([source, count]) => `${source}:${count}件`)
      .join(', ')}`
  );

  // priceDataを生成（全商品の価格情報を含む）
  const priceData = groupProducts.map((product) => ({
    source: product.source || 'unknown',
    amount: product.priceJPY,
    currency: 'JPY',
    url: product.affiliateUrl || '#',
    fetchedAt: new Date().toISOString(),
    confidence: 0.95, // JANコード一致なので高い信頼度
    storeName: extractStoreName(product.name, product.source),
    itemCode: product.itemCode,
  }));

  // 価格順にソート（安い順）
  priceData.sort((a, b) => a.amount - b.amount);

  console.log(`\n💰 価格一覧（安い順）:`);
  priceData.forEach((pd, index) => {
    const badge = index === 0 ? '🏆 最安値' : '';
    console.log(
      `  ${index + 1}. [${pd.source}] ${pd.storeName || '不明'} - ¥${pd.amount.toLocaleString()} ${badge}`
    );
  });

  // グループ内の全商品を更新
  console.log(`\n🔄 ${groupProducts.length}件の商品を更新中...`);
  for (const product of groupProducts) {
    try {
      await client.patch(product._id).set({ priceData }).commit();
      totalUpdated++;
      console.log(`   ✅ ${product._id.substring(0, 20)}...`);
    } catch (error) {
      console.error(`   ❌ ${product._id}: ${error.message}`);
      totalErrors++;
    }
  }
}

console.log('\n' + '='.repeat(80));
console.log(`\n✅ 更新完了: ${totalUpdated}件の商品にpriceDataを追加しました`);
if (totalErrors > 0) {
  console.log(`❌ エラー: ${totalErrors}件`);
}
console.log('');

console.log('💡 確認方法:');
console.log('   商品詳細ページで価格比較セクションを確認してください');
console.log('   例: http://localhost:3000/products/[slug]\n');

/**
 * 商品名またはitemCodeから販売元名を抽出
 */
function extractStoreName(productName, source) {
  if (source === 'rakuten') {
    // 楽天の場合、商品名から販売元を推測
    // 例: "【shop-name】商品名" のパターン
    const match = productName.match(/【(.+?)】/);
    if (match) {
      return match[1];
    }
    return '楽天市場';
  } else if (source === 'yahoo') {
    return 'Yahoo!ショッピング';
  }
  return source;
}
