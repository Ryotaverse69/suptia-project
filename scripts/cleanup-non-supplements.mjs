#!/usr/bin/env node

/**
 * 非サプリメント商品クリーンアップスクリプト
 *
 * Sanityに混入した非サプリメント商品（化粧品など）を検出・削除します。
 *
 * 使い方:
 *   node scripts/cleanup-non-supplements.mjs [options]
 *
 * オプション:
 *   --dry-run    実際には削除せず、検出結果のみ表示（デフォルト）
 *   --execute    実際に削除を実行
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { validateProduct } from './lib/product-filters.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 環境変数読み込み
const envPath = join(__dirname, '../apps/web/.env.local');
const envContent = readFileSync(envPath, 'utf8');

const SANITY_API_TOKEN = envContent.match(/SANITY_API_TOKEN=(.+)/)?.[1]?.trim();
const SANITY_PROJECT_ID = 'fny3jdcg';
const SANITY_DATASET = 'production';

if (!SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN が見つかりません');
  process.exit(1);
}

// コマンドライン引数
const args = process.argv.slice(2);
const executeMode = args.includes('--execute');

console.log('🧹 非サプリメント商品クリーンアップスクリプト');
console.log(`モード: ${executeMode ? '⚠️ 削除実行' : '🔍 ドライラン（検出のみ）'}`);
console.log('');

// Sanityから全商品を取得
async function fetchAllProducts() {
  const query = '*[_type == "product"]{ _id, name, source, itemCode, slug }';
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2023-05-03/data/query/${SANITY_DATASET}?query=${encodeURIComponent(query)}`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${SANITY_API_TOKEN}` },
  });

  if (!response.ok) {
    throw new Error(`Sanity API error: ${response.status}`);
  }

  const data = await response.json();
  return data.result;
}

// 商品を削除
async function deleteProduct(productId) {
  const mutations = [{ delete: { id: productId } }];
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2023-05-03/data/mutate/${SANITY_DATASET}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SANITY_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ mutations }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Delete error: ${JSON.stringify(error)}`);
  }

  return true;
}

async function main() {
  try {
    console.log('📥 Sanityから全商品を取得中...');
    const products = await fetchAllProducts();
    console.log(`  取得完了: ${products.length}件`);
    console.log('');

    // 非サプリメント商品を検出
    const invalidProducts = [];

    for (const product of products) {
      const validation = validateProduct(product);
      if (!validation.isValid) {
        invalidProducts.push({
          ...product,
          reason: validation.reason,
        });
      }
    }

    console.log('🔍 検出結果:');
    console.log(`  有効商品: ${products.length - invalidProducts.length}件`);
    console.log(`  非サプリメント商品: ${invalidProducts.length}件`);
    console.log('');

    if (invalidProducts.length === 0) {
      console.log('✅ 非サプリメント商品は見つかりませんでした');
      return;
    }

    // 検出された商品を表示
    console.log('❌ 削除対象の商品:');
    console.log('─'.repeat(80));

    for (const product of invalidProducts) {
      console.log(`  ID: ${product._id}`);
      console.log(`  名前: ${product.name}`);
      console.log(`  ソース: ${product.source}`);
      console.log(`  理由: ${product.reason}`);
      console.log('─'.repeat(80));
    }

    if (!executeMode) {
      console.log('');
      console.log('💡 実際に削除するには --execute オプションを付けて実行してください:');
      console.log('   node scripts/cleanup-non-supplements.mjs --execute');
      return;
    }

    // 削除実行
    console.log('');
    console.log('🗑️ 削除を実行中...');

    let deletedCount = 0;
    let errorCount = 0;

    for (const product of invalidProducts) {
      try {
        await deleteProduct(product._id);
        console.log(`  ✅ 削除: ${product.name.substring(0, 50)}...`);
        deletedCount++;
      } catch (error) {
        console.log(`  ❌ エラー: ${product.name.substring(0, 50)}... - ${error.message}`);
        errorCount++;
      }

      // レート制限対策
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log('');
    console.log('📊 削除結果:');
    console.log(`  削除成功: ${deletedCount}件`);
    console.log(`  削除失敗: ${errorCount}件`);

  } catch (error) {
    console.error('❌ エラー:', error.message);
    process.exit(1);
  }
}

main();
