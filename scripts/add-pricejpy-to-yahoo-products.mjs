#!/usr/bin/env node

/**
 * Yahoo!商品にpriceJPYフィールドを追加
 *
 * 目的: priceDataからpriceJPYを生成し、商品一覧で表示されるようにする
 *
 * 処理内容:
 * 1. Yahoo!商品でpriceJPYがないものを検出
 * 2. priceData[0].amountからpriceJPYを設定
 * 3. Sanityを更新
 *
 * 使用方法:
 *   node scripts/add-pricejpy-to-yahoo-products.mjs
 */

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

if (!SANITY_PROJECT_ID || !SANITY_DATASET || !SANITY_API_TOKEN) {
  console.error('❌ Error: Sanity credentials not found in .env.local');
  process.exit(1);
}

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  token: SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

/**
 * Yahoo!商品を取得
 */
async function getYahooProducts() {
  const query = `*[_type == "product" && source == "yahoo"] {
    _id,
    name,
    priceJPY,
    priceData[] {
      amount,
      source,
      shopName
    }
  }`;

  return await client.fetch(query);
}

/**
 * 商品のpriceJPYを更新
 */
async function updateProductPriceJPY(productId, priceJPY) {
  await client.patch(productId).set({ priceJPY }).commit();
}

/**
 * メイン処理
 */
async function main() {
  console.log('🔧 Yahoo!商品にpriceJPYを追加中...\n');

  const products = await getYahooProducts();
  console.log(`📦 対象商品数: ${products.length}件\n`);

  let updatedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const product of products) {
    try {
      // priceJPYが既にある場合はスキップ
      if (product.priceJPY) {
        console.log(`✅ スキップ: ${product.name} - priceJPY既存 (¥${product.priceJPY})`);
        skippedCount++;
        continue;
      }

      // priceDataから価格を取得
      if (!product.priceData || product.priceData.length === 0) {
        console.error(`❌ エラー: ${product.name} - priceDataがありません`);
        errorCount++;
        continue;
      }

      const priceJPY = product.priceData[0].amount;

      if (!priceJPY || typeof priceJPY !== 'number' || priceJPY <= 0) {
        console.error(`❌ エラー: ${product.name} - 無効な価格 (${priceJPY})`);
        errorCount++;
        continue;
      }

      console.log(`🔧 更新中: ${product.name}`);
      console.log(`   価格: ¥${priceJPY} (${product.priceData[0].shopName || 'Yahoo!ショッピング'})`);

      await updateProductPriceJPY(product._id, priceJPY);

      console.log(`   ✅ 更新完了\n`);
      updatedCount++;
    } catch (error) {
      console.error(`❌ エラー: ${product.name} - ${error.message}\n`);
      errorCount++;
    }
  }

  // 結果サマリー
  console.log('='.repeat(80));
  console.log('📊 更新結果サマリー');
  console.log('='.repeat(80));
  console.log(`✅ 更新完了: ${updatedCount}件`);
  console.log(`⏭️  スキップ: ${skippedCount}件`);
  console.log(`❌ エラー: ${errorCount}件`);
  console.log(`📦 合計: ${products.length}件\n`);

  if (updatedCount > 0) {
    console.log('💡 次のステップ:');
    console.log('   ローカルで http://localhost:3000/products を確認してください');
    console.log('   Yahoo!商品が表示されるはずです\n');
  }
}

main().catch(console.error);
