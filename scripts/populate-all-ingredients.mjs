#!/usr/bin/env node
/**
 * 既存商品のallIngredientsフィールドをdescriptionから自動設定するスクリプト
 *
 * 楽天・Yahoo商品のallIngredientsフィールドがnull/undefinedの場合、
 * descriptionフィールドの値をコピーします。
 *
 * 実行方法:
 *   node scripts/populate-all-ingredients.mjs
 *   node scripts/populate-all-ingredients.mjs --fix  # 実際に更新
 */

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: 'apps/web/.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fny3jdcg',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2025-01-01',
  token: process.env.SANITY_API_TOKEN,
});

async function main() {
  const isDryRun = !process.argv.includes('--fix');

  console.log('\n🔍 allIngredientsフィールドが欠損している商品を検索中...\n');

  // allIngredientsがnull/undefinedだがdescriptionがある商品を取得
  const query = `*[_type == 'product' && (source == 'rakuten' || source == 'yahoo') && defined(description) && !defined(allIngredients)]{
    _id,
    name,
    source,
    description
  }`;

  const products = await client.fetch(query);

  console.log(`対象商品数: ${products.length}件\n`);

  if (products.length === 0) {
    console.log('✅ allIngredientsフィールドが欠損している商品はありません。');
    return;
  }

  if (isDryRun) {
    console.log('⚠️ Dry Run モード（--fix フラグを付けると実際に更新します）\n');
  } else {
    console.log('✅ 更新モード（実際にSanityを更新します）\n');
  }

  let updatedCount = 0;

  for (const product of products) {
    const descriptionLength = product.description?.length || 0;
    console.log(`📦 ${product.source.toUpperCase()}: ${product.name.substring(0, 50)}...`);
    console.log(`   description長: ${descriptionLength}文字`);

    if (!isDryRun) {
      try {
        await client
          .patch(product._id)
          .set({
            allIngredients: product.description,
          })
          .commit();

        console.log(`   ✅ allIngredientsフィールドを設定しました\n`);
        updatedCount++;
      } catch (error) {
        console.error(`   ❌ 更新エラー: ${error.message}\n`);
      }
    } else {
      console.log(`   💡 Dry Run: 更新をスキップ\n`);
    }
  }

  // サマリー
  console.log('\n📊 実行結果サマリー');
  console.log(`   対象商品: ${products.length}件`);

  if (!isDryRun) {
    console.log(`   💾 更新した商品: ${updatedCount}件`);
  } else {
    console.log(`\n💡 実際に更新するには、--fix フラグを付けて再実行してください：`);
    console.log(`   node scripts/populate-all-ingredients.mjs --fix\n`);
  }
}

main().catch((error) => {
  console.error('エラーが発生しました:', error);
  process.exit(1);
});
