#!/usr/bin/env node

/**
 * 紅茶キノコの配合量を更新するスクリプト
 */

import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, "../apps/web/.env.local") });

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "fny3jdcg";
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const SANITY_API_TOKEN = process.env.SANITY_API_TOKEN;

if (!SANITY_API_TOKEN) {
  console.error("❌ エラー: SANITY_API_TOKEN環境変数が設定されていません");
  process.exit(1);
}

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  token: SANITY_API_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

const shouldFix = process.argv.includes("--fix");
const isDryRun = !shouldFix;

async function updateKombuchaAmount() {
  console.log(`🔍 紅茶キノコの配合量を更新${isDryRun ? '（プレビューモード）' : ''}...\n`);

  try {
    const productSlug = '11-4-298-1-d-c-b';
    const product = await client.fetch(
      `*[_type == "product" && slug.current == $slug][0]{
        _id,
        name,
        ingredients
      }`,
      { slug: productSlug }
    );

    if (!product) {
      console.error(`❌ 商品が見つかりません: ${productSlug}`);
      process.exit(1);
    }

    console.log(`📦 対象商品: ${product.name}\n`);

    // 紅茶キノコ成分を見つける
    const kombuchaIndex = product.ingredients?.findIndex(
      (ing) => ing.ingredient?._ref === 'ingredient-kombucha-extract'
    );

    if (kombuchaIndex === -1 || kombuchaIndex === undefined) {
      console.error('❌ 紅茶キノコ成分が見つかりません');
      process.exit(1);
    }

    const currentAmount = product.ingredients[kombuchaIndex].amountMgPerServing;
    const newAmount = 2000;

    console.log(`📝 更新内容:`);
    console.log(`  紅茶キノコ配合量: ${currentAmount}mg → ${newAmount}mg\n`);

    if (isDryRun) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('💡 次のステップ');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      console.log('実際に更新を適用するには、--fix オプションを付けて実行してください:');
      console.log('  node scripts/update-kombucha-amount.mjs --fix\n');
    } else {
      // 配合量を更新
      const updatedIngredients = [...product.ingredients];
      updatedIngredients[kombuchaIndex] = {
        ...updatedIngredients[kombuchaIndex],
        amountMgPerServing: newAmount
      };

      await client
        .patch(product._id)
        .set({ ingredients: updatedIngredients })
        .commit();

      console.log('✅ 配合量を更新しました！\n');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ 完了');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      console.log('次のステップ:');
      console.log('1. ページをリロードして主要成分が「紅茶キノコ」になっているか確認\n');
    }

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

updateKombuchaAmount()
  .then(() => {
    console.log('✅ スクリプト完了\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  });
