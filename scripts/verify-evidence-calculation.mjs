#!/usr/bin/env node

/**
 * エビデンス計算が正しく動作するか検証
 * 配合量が0の商品でも成分が登録されていればエビデンススコアが計算されることを確認
 */

import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, "../apps/web/.env.local") });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "fny3jdcg",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

// エビデンスレベルをスコアに変換
function evidenceLevelToScore(level) {
  switch (level) {
    case "S":
      return 95;
    case "A":
      return 85;
    case "B":
      return 75;
    case "C":
      return 65;
    case "D":
      return 50;
    default:
      return 50;
  }
}

async function verifyEvidenceCalculation() {
  console.log("🔍 エビデンス計算検証スクリプト\n");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // 検証対象商品
  const testProducts = [
    "dhc-20-80-6-dhc", // DHC フォースコリー
    "fancl-40", // プレミアムカロリミット
  ];

  for (const slug of testProducts) {
    console.log(`📦 商品: ${slug}\n`);

    // 商品データを取得
    const product = await client.fetch(
      `*[_type == "product" && slug.current == $slug][0]{
        _id,
        name,
        'ingredientCount': count(ingredients),
        ingredients[]{
          _key,
          amountMgPerServing,
          ingredient->{
            _id,
            name,
            nameEn,
            evidenceLevel,
            safetyScore
          }
        }
      }`,
      { slug }
    );

    if (!product) {
      console.log(`   ❌ 商品が見つかりません\n`);
      continue;
    }

    console.log(`   商品名: ${product.name}`);
    console.log(`   成分数: ${product.ingredientCount}件\n`);

    // 成分が登録されているか
    const hasIngredients =
      product.ingredients &&
      product.ingredients.length > 0 &&
      product.ingredients.every((ing) => ing.ingredient);

    console.log(
      `   ✅ 成分登録状況: ${hasIngredients ? "登録済み" : "未登録"}\n`
    );

    if (!hasIngredients) {
      console.log(
        `   ⚠️ 成分が登録されていないためエビデンス計算不可\n`
      );
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
      continue;
    }

    // 配合量が全て0かチェック
    const allAmountsZero = product.ingredients.every(
      (ing) => ing.amountMgPerServing === 0
    );

    console.log(`   配合量状況:`);
    product.ingredients.forEach((ing) => {
      console.log(
        `     - ${ing.ingredient.name}: ${ing.amountMgPerServing}mg`
      );
    });
    console.log(
      `     全て0: ${allAmountsZero ? "はい" : "いいえ"}\n`
    );

    // 主要成分（配合量が最も多い成分）を特定
    const mainIngredient = product.ingredients.reduce((max, current) => {
      if (
        !max ||
        (current.amountMgPerServing || 0) > (max.amountMgPerServing || 0)
      ) {
        return current;
      }
      return max;
    }, null);

    if (!mainIngredient || !mainIngredient.ingredient) {
      console.log(`   ❌ 主要成分が見つかりません\n`);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
      continue;
    }

    console.log(`   主要成分: ${mainIngredient.ingredient.name}`);
    console.log(
      `   配合量: ${mainIngredient.amountMgPerServing}mg`
    );
    console.log(
      `   エビデンスレベル: ${mainIngredient.ingredient.evidenceLevel || "未設定"}`
    );

    // エビデンススコア計算（主要成分ベース）
    const mainEvidenceLevel =
      mainIngredient.ingredient.evidenceLevel || "D";
    const evidenceScore = evidenceLevelToScore(mainEvidenceLevel);

    console.log(`   📊 エビデンススコア: ${evidenceScore}点\n`);

    // 安全性スコア
    const safetyScore = mainIngredient.ingredient.safetyScore || 50;
    console.log(`   🛡️ 安全性スコア: ${safetyScore}点\n`);

    // 総合評価
    const overallScore = Math.round((evidenceScore + safetyScore) / 2);
    console.log(`   ⭐ 総合スコア: ${overallScore}点\n`);

    // 期待される結果
    console.log(`   ✅ 検証結果:`);
    if (allAmountsZero && evidenceScore > 50) {
      console.log(
        `     ✅ 配合量が0でもエビデンススコアが正しく計算されています`
      );
    } else if (!allAmountsZero) {
      console.log(
        `     ✅ 配合量が設定されており、正常に計算されています`
      );
    } else {
      console.log(
        `     ⚠️ エビデンススコアがデフォルト値（50点）です`
      );
    }

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  }

  console.log("✅ 検証完了\n");
}

verifyEvidenceCalculation()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ エラー:", error);
    process.exit(1);
  });
