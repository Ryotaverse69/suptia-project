#!/usr/bin/env node

/**
 * 非サプリメント商品クリーンアップスクリプト
 *
 * 既存のSanity商品データから非サプリメント商品を検出し、削除します。
 *
 * 使い方:
 *   node scripts/clean-non-supplement-products.mjs [options]
 *
 * オプション:
 *   --dry-run    実際には削除せず、削除対象のみ表示
 *   --delete     実際に削除を実行（確認プロンプトあり）
 *   --yes        確認プロンプトをスキップ（--deleteと併用）
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

if (!SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN が見つかりません');
  process.exit(1);
}

// Sanity設定
const SANITY_PROJECT_ID = 'fny3jdcg';
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = '2023-05-03';
const SANITY_API_URL = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data`;

// Sanity操作
async function queryAllProducts() {
  const query = encodeURIComponent(`
    *[_type == "product"]{
      _id,
      name,
      source,
      itemCode,
      janCode,
      priceJPY,
      brand->{name}
    }
  `);
  const url = `${SANITY_API_URL}/query/${SANITY_DATASET}?query=${query}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${SANITY_API_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Sanity query failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.result || [];
}

async function deleteProducts(productIds, dryRun = true) {
  if (dryRun) {
    console.log('\n🔍 DRY RUN モード - 実際には削除されません');
    console.log(`  削除対象: ${productIds.length}件\n`);
    return { deleted: 0, errors: 0 };
  }

  console.log(`\n⚠️  ${productIds.length}件の商品を削除します...`);

  const mutations = productIds.map(id => ({
    delete: { id },
  }));

  const response = await fetch(`${SANITY_API_URL}/mutate/${SANITY_DATASET}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SANITY_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ mutations }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Sanity mutation failed: ${JSON.stringify(error)}`);
  }

  console.log('✅ 削除完了！');
  return { deleted: productIds.length, errors: 0 };
}

// メイン処理
async function main() {
  const args = process.argv.slice(2);
  const dryRun = !args.includes('--delete');
  const skipConfirmation = args.includes('--yes');

  console.log('🧹 非サプリメント商品クリーンアップスクリプト\n');
  console.log(`  モード: ${dryRun ? 'DRY RUN（削除しない）' : '実行モード（削除する）'}\n`);

  try {
    // 全商品を取得
    console.log('📥 Sanityから全商品を取得中...');
    const allProducts = await queryAllProducts();
    console.log(`  商品数: ${allProducts.length}件\n`);

    if (allProducts.length === 0) {
      console.log('⚠️  商品が見つかりませんでした');
      return;
    }

    // ========================================
    // 各商品をvalidateProductでチェック
    // ========================================
    console.log('🔍 全商品をチェック中...\n');
    const validProducts = [];
    const invalidProducts = [];

    for (const product of allProducts) {
      const validation = validateProduct({
        name: product.name,
        // 楽天・Yahoo商品の場合はsourceでカテゴリ判定も可能だが、基本的に商品名で判断
      });

      if (validation.isValid) {
        validProducts.push(product);
      } else {
        invalidProducts.push({ product, validation });
        console.log(`  ❌ 非サプリ: ${product.name.substring(0, 60)}...`);
        console.log(`     理由: ${validation.reason}`);
        console.log(`     ID: ${product._id}`);
        console.log(`     ソース: ${product.source}`);
        console.log();
      }
    }

    console.log('='.repeat(80));
    console.log('\n📊 チェック結果:');
    console.log(`  総商品数: ${allProducts.length}件`);
    console.log(`  ✅ 有効商品（サプリメント）: ${validProducts.length}件`);
    console.log(`  ❌ 無効商品（非サプリメント）: ${invalidProducts.length}件\n`);

    if (invalidProducts.length === 0) {
      console.log('✨ すべての商品がサプリメントです！クリーンアップ不要。');
      return;
    }

    // 無効商品の詳細リスト
    console.log('📝 削除対象商品リスト:');
    console.log('='.repeat(80));
    for (const { product, validation } of invalidProducts) {
      console.log(`  • ${product.name}`);
      console.log(`    ID: ${product._id}`);
      console.log(`    ソース: ${product.source || 'unknown'}`);
      console.log(`    ブランド: ${product.brand?.name || 'N/A'}`);
      console.log(`    価格: ¥${product.priceJPY?.toLocaleString() || 'N/A'}`);
      console.log(`    理由: ${validation.reason}`);
      console.log();
    }

    // 削除実行
    if (!dryRun) {
      console.log('\n⚠️  警告: この操作は元に戻せません！');
      console.log(`  ${invalidProducts.length}件の商品を完全に削除します。\n`);

      // 確認プロンプト（--yesフラグでスキップ可能）
      if (!skipConfirmation) {
        const readline = await import('readline');
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });

        const answer = await new Promise(resolve => {
          rl.question('本当に削除しますか？ (yes/no): ', resolve);
        });
        rl.close();

        if (answer.toLowerCase() !== 'yes') {
          console.log('\n❌ キャンセルされました');
          return;
        }
      } else {
        console.log('  --yesフラグが指定されているため、確認をスキップします。\n');
      }

      const productIds = invalidProducts.map(({ product }) => product._id);
      const result = await deleteProducts(productIds, false);

      console.log('\n📊 削除結果:');
      console.log(`  削除成功: ${result.deleted}件`);
      console.log(`  エラー: ${result.errors}件`);
    } else {
      console.log('\n💡 実際に削除するには、--delete オプションを付けて実行してください:');
      console.log('   node scripts/clean-non-supplement-products.mjs --delete');
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
