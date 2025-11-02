#!/usr/bin/env node

/**
 * 全商品の販売元表示スクリプト
 *
 * 全商品のブランド名と販売元（shopName）を一覧表示します
 */

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

// Sanity設定
const SANITY_PROJECT_ID = 'fny3jdcg';
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = '2023-05-03';
const SANITY_API_URL = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data`;

async function queryAllProducts() {
  const query = '*[_type == "product" && source in ["rakuten", "yahoo"]] | order(source asc, name asc) { _id, name, brand->{_id, name}, source, priceData }';
  const encodedQuery = encodeURIComponent(query);
  const url = `${SANITY_API_URL}/query/${SANITY_DATASET}?query=${encodedQuery}&perspective=previewDrafts`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${SANITY_API_TOKEN}`,
      'Cache-Control': 'no-cache',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error details:', errorText);
    throw new Error(`Sanity query failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.result || [];
}

async function main() {
  console.log('📊 全商品の販売元情報を取得中...\n');

  try {
    const products = await queryAllProducts();

    console.log(`合計商品数: ${products.length}件\n`);
    console.log('='.repeat(120));
    console.log('商品名'.padEnd(50) + 'ブランド'.padEnd(25) + '販売元'.padEnd(30) + 'ソース');
    console.log('='.repeat(120));

    let rakutenCount = 0;
    let yahooCount = 0;
    let withBrandCount = 0;
    let withoutBrandCount = 0;

    for (const product of products) {
      const productName = product.name.substring(0, 47) + (product.name.length > 47 ? '...' : '');
      const brandName = product.brand?.name || 'なし';
      const firstPriceData = product.priceData?.[0];
      const shopName = firstPriceData?.shopName || firstPriceData?.storeName || 'なし';
      const source = product.source === 'rakuten' ? '楽天' : 'Yahoo';

      console.log(
        productName.padEnd(50) +
        brandName.substring(0, 22).padEnd(25) +
        shopName.substring(0, 27).padEnd(30) +
        source
      );

      // 統計
      if (product.source === 'rakuten') rakutenCount++;
      if (product.source === 'yahoo') yahooCount++;
      if (product.brand?.name) withBrandCount++;
      else withoutBrandCount++;
    }

    console.log('='.repeat(120));
    console.log('\n📊 統計情報:');
    console.log(`  楽天市場: ${rakutenCount}件`);
    console.log(`  Yahoo!ショッピング: ${yahooCount}件`);
    console.log(`  ブランド設定済み: ${withBrandCount}件`);
    console.log(`  ブランド未設定: ${withoutBrandCount}件`);

    // 販売元別集計
    const sellerMap = new Map();
    for (const product of products) {
      const firstPriceData = product.priceData?.[0];
      const shopName = firstPriceData?.shopName || firstPriceData?.storeName || 'なし';
      sellerMap.set(shopName, (sellerMap.get(shopName) || 0) + 1);
    }

    const topSellers = Array.from(sellerMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    console.log('\n📊 販売元TOP10:');
    for (const [seller, count] of topSellers) {
      console.log(`  ${seller}: ${count}件`);
    }

    // ブランド別集計
    const brandMap = new Map();
    for (const product of products) {
      const brandName = product.brand?.name || 'なし';
      brandMap.set(brandName, (brandMap.get(brandName) || 0) + 1);
    }

    const topBrands = Array.from(brandMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    console.log('\n📊 ブランドTOP10:');
    for (const [brand, count] of topBrands) {
      console.log(`  ${brand}: ${count}件`);
    }

  } catch (error) {
    console.error('\n❌ エラー:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main();
