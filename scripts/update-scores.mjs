#!/usr/bin/env node

/**
 * 商品のrecommendationScoreと成分のpopularityScoreを自動更新するスクリプト
 *
 * 実行方法:
 * node scripts/update-scores.mjs
 *
 * または GitHub Actions で毎日自動実行
 */

import { createClient } from "@sanity/client";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 環境変数を読み込み
dotenv.config({ path: resolve(__dirname, "../apps/web/.env.local") });

// Sanityクライアントを初期化
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_TOKEN,
  apiVersion: process.env.SANITY_API_VERSION || "2024-01-01",
  useCdn: false,
});

console.log("🚀 スコア自動更新スクリプトを開始します...\n");

/**
 * 1. 商品の割引率とおすすめスコアを更新
 */
async function updateProductScores() {
  console.log("📦 商品のスコアを更新中...");

  try {
    // 全商品を取得
    const products = await client.fetch(`
      *[_type == "product"]{
        _id,
        priceJPY,
        originalPrice,
        isCampaign,
        campaignEndDate
      }
    `);

    console.log(`   ${products.length}件の商品を取得しました`);

    let updatedCount = 0;
    const now = new Date();

    for (const product of products) {
      let needsUpdate = false;
      const updates = {};

      // 割引率を計算
      if (
        product.originalPrice &&
        product.originalPrice > 0 &&
        product.priceJPY < product.originalPrice
      ) {
        const discountPercentage =
          ((product.originalPrice - product.priceJPY) / product.originalPrice) *
          100;
        updates.discountPercentage = Math.round(discountPercentage * 10) / 10; // 小数点1桁
        needsUpdate = true;
      } else if (product.originalPrice && product.priceJPY >= product.originalPrice) {
        // 元の価格より高い場合は割引率0
        updates.discountPercentage = 0;
        needsUpdate = true;
      }

      // おすすめスコアを計算
      // スコア = (キャンペーン: 100点) + (割引率 × 2)
      let recommendationScore = 0;

      // キャンペーン中かチェック
      const isCampaignActive =
        product.isCampaign &&
        (!product.campaignEndDate || new Date(product.campaignEndDate) > now);

      if (isCampaignActive) {
        recommendationScore += 100;
      }

      if (updates.discountPercentage > 0) {
        recommendationScore += updates.discountPercentage * 2;
      }

      updates.recommendationScore = Math.round(recommendationScore * 10) / 10;
      needsUpdate = true;

      // 更新が必要な場合のみSanityを更新
      if (needsUpdate) {
        await client.patch(product._id).set(updates).commit();
        updatedCount++;
      }
    }

    console.log(`   ✅ ${updatedCount}件の商品スコアを更新しました\n`);
  } catch (error) {
    console.error("   ❌ 商品スコア更新エラー:", error);
    throw error;
  }
}

/**
 * 2. 成分のpopularityScoreを更新
 */
async function updateIngredientScores() {
  console.log("🌿 成分の人気度スコアを更新中...");

  try {
    // 全成分を取得
    const ingredients = await client.fetch(`
      *[_type == "ingredient"]{
        _id,
        viewCount,
        "productCount": count(*[_type == "product" && references(^._id)])
      }
    `);

    console.log(`   ${ingredients.length}件の成分を取得しました`);

    let updatedCount = 0;

    for (const ingredient of ingredients) {
      // popularityScore = (商品数 × 10) + (表示回数 × 1)
      const productCount = ingredient.productCount || 0;
      const viewCount = ingredient.viewCount || 0;
      const popularityScore = productCount * 10 + viewCount * 1;

      // Sanityを更新
      await client
        .patch(ingredient._id)
        .set({ popularityScore })
        .commit();

      updatedCount++;
    }

    console.log(`   ✅ ${updatedCount}件の成分スコアを更新しました\n`);
  } catch (error) {
    console.error("   ❌ 成分スコア更新エラー:", error);
    throw error;
  }
}

/**
 * メイン処理
 */
async function main() {
  try {
    // 1. 商品スコアを更新
    await updateProductScores();

    // 2. 成分スコアを更新
    await updateIngredientScores();

    console.log("✨ すべてのスコア更新が完了しました！");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ エラーが発生しました:", error);
    process.exit(1);
  }
}

// 実行
main();
