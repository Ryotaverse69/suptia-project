#!/usr/bin/env node
/**
 * 商品名から成分を自動推測して紐付けるスクリプト
 *
 * 使用方法:
 *   node scripts/link-ingredients-to-products.mjs
 *   node scripts/link-ingredients-to-products.mjs --dry-run  # テスト実行（更新しない）
 */

import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 環境変数読み込み
const envPath = join(__dirname, '../apps/web/.env.local');
try {
  const envContent = readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      process.env[key] = value;
    }
  });
} catch (err) {
  console.warn('⚠️  .env.local が見つかりません。環境変数を直接使用します。');
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fny3jdcg',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const DRY_RUN = process.argv.includes('--dry-run');

/**
 * 成分マスタから検索キーワードマップを作成
 */
async function buildIngredientKeywordMap() {
  console.log('📚 成分マスタを取得中...');

  const ingredients = await client.fetch(`
    *[_type == "ingredient"]{
      _id,
      name,
      nameEn,
      aliases,
      category
    }
  `);

  console.log(`✅ ${ingredients.length}件の成分を取得しました`);

  // キーワード → 成分IDのマップを作成
  const keywordMap = new Map();

  for (const ingredient of ingredients) {
    const keywords = [];

    // 日本語名からキーワードを抽出
    if (ingredient.name) {
      // "ビタミンC（アスコルビン酸）" → ["ビタミンC", "アスコルビン酸"]
      const cleaned = ingredient.name.replace(/[（）()]/g, '|');
      keywords.push(...cleaned.split('|').filter(Boolean));
    }

    // 英語名からキーワードを抽出
    if (ingredient.nameEn) {
      // "Vitamin C (Ascorbic Acid)" → ["Vitamin C", "Ascorbic Acid"]
      const cleaned = ingredient.nameEn.replace(/[（）()]/g, '|');
      keywords.push(...cleaned.split('|').filter(Boolean));
    }

    // エイリアス
    if (ingredient.aliases && Array.isArray(ingredient.aliases)) {
      keywords.push(...ingredient.aliases);
    }

    // 各キーワードをマップに登録
    for (const keyword of keywords) {
      const normalized = keyword.trim().toLowerCase();
      if (normalized) {
        if (!keywordMap.has(normalized)) {
          keywordMap.set(normalized, []);
        }
        keywordMap.get(normalized).push({
          id: ingredient._id,
          name: ingredient.name,
          category: ingredient.category,
        });
      }
    }
  }

  console.log(`✅ ${keywordMap.size}個のキーワードを登録しました`);
  return keywordMap;
}

/**
 * 商品名から成分を推測
 */
function detectIngredientsFromProductName(productName, keywordMap) {
  const detectedIngredients = [];
  const normalizedProductName = productName.toLowerCase();

  for (const [keyword, ingredients] of keywordMap.entries()) {
    if (normalizedProductName.includes(keyword)) {
      detectedIngredients.push(...ingredients);
    }
  }

  // 重複を除去（同じ成分IDが複数回マッチした場合）
  const uniqueIngredients = Array.from(
    new Map(detectedIngredients.map(ing => [ing.id, ing])).values()
  );

  return uniqueIngredients;
}

/**
 * 成分が未設定の商品を取得
 */
async function getProductsWithoutIngredients() {
  console.log('\n📦 成分未設定の商品を取得中...');

  const products = await client.fetch(`
    *[_type == "product" && (!defined(ingredients) || count(ingredients) == 0)]{
      _id,
      name,
      slug
    }
  `);

  console.log(`✅ ${products.length}件の成分未設定商品を取得しました`);
  return products;
}

/**
 * 商品に成分を紐付け
 */
async function linkIngredientsToProduct(productId, ingredientIds) {
  if (DRY_RUN) {
    console.log(`  [DRY-RUN] 商品 ${productId} に成分を紐付けをスキップ`);
    return;
  }

  // ingredients配列を作成（デフォルト値として1000mgを設定）
  const ingredients = ingredientIds.map(id => ({
    _type: 'object',
    _key: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ingredient: {
      _type: 'reference',
      _ref: id,
    },
    amountMgPerServing: 1000, // デフォルト値（後で手動調整が必要）
  }));

  await client
    .patch(productId)
    .set({ ingredients })
    .commit();
}

/**
 * メイン処理
 */
async function main() {
  console.log('🚀 成分自動推測スクリプトを開始します');
  console.log(`モード: ${DRY_RUN ? 'テスト実行（更新なし）' : '本番実行'}\n`);

  try {
    // 1. 成分マスタからキーワードマップを作成
    const keywordMap = await buildIngredientKeywordMap();

    // 2. 成分未設定の商品を取得
    const products = await getProductsWithoutIngredients();

    if (products.length === 0) {
      console.log('\n✅ すべての商品に成分が設定されています');
      return;
    }

    // 3. 各商品に対して成分を推測して紐付け
    console.log('\n🔍 成分の推測を開始...\n');
    let updatedCount = 0;
    let skippedCount = 0;

    for (const product of products) {
      const detectedIngredients = detectIngredientsFromProductName(
        product.name,
        keywordMap
      );

      if (detectedIngredients.length > 0) {
        console.log(`✅ ${product.name.substring(0, 60)}...`);
        console.log(`   → 検出: ${detectedIngredients.map(i => i.name).join(', ')}`);

        await linkIngredientsToProduct(
          product._id,
          detectedIngredients.map(i => i.id)
        );
        updatedCount++;
      } else {
        console.log(`⚠️  ${product.name.substring(0, 60)}...`);
        console.log(`   → 成分を検出できませんでした`);
        skippedCount++;
      }
    }

    // 4. 結果サマリー
    console.log('\n' + '='.repeat(60));
    console.log('📊 実行結果');
    console.log('='.repeat(60));
    console.log(`✅ 成分を紐付けた商品: ${updatedCount}件`);
    console.log(`⚠️  成分を検出できなかった商品: ${skippedCount}件`);
    console.log(`📦 処理対象商品: ${products.length}件`);

    if (DRY_RUN) {
      console.log('\n💡 本番実行するには --dry-run オプションを外してください');
    } else {
      console.log('\n✅ すべての更新が完了しました');
    }

  } catch (error) {
    console.error('\n❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

main();
