/**
 * 全商品のscoresを自動計算してSanityに更新するスクリプト
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 環境変数読み込み
const envPath = join(__dirname, "../apps/web/.env.local");
const envContent = readFileSync(envPath, "utf8");

const SANITY_PROJECT_ID = envContent.match(/NEXT_PUBLIC_SANITY_PROJECT_ID=(.+)/)?.[1]?.trim();
const SANITY_DATASET = envContent.match(/NEXT_PUBLIC_SANITY_DATASET=(.+)/)?.[1]?.trim() || "production";
const SANITY_API_TOKEN = envContent.match(/SANITY_API_TOKEN=(.+)/)?.[1]?.trim();

if (!SANITY_PROJECT_ID || !SANITY_API_TOKEN) {
  console.error("❌ 環境変数が不足しています");
  console.error("  SANITY_PROJECT_ID:", SANITY_PROJECT_ID ? "✓" : "✗");
  console.error("  SANITY_API_TOKEN:", SANITY_API_TOKEN ? "✓" : "✗");
  process.exit(1);
}

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  token: SANITY_API_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

/**
 * 成分名から自動的にスコアを推測
 */
function calculateAutoScores(productName, allIngredients) {
  const nameLower = productName.toLowerCase();
  const foundIngredients = [];

  // 商品名に含まれる成分を検出
  for (const ingredient of allIngredients) {
    const patterns = [
      ingredient.name,
      ingredient.nameEn?.toLowerCase(),
      ...(ingredient.aliases || []),
    ].filter(Boolean);

    for (const pattern of patterns) {
      if (nameLower.includes(pattern.toLowerCase())) {
        foundIngredients.push(ingredient);
        break;
      }
    }
  }

  if (foundIngredients.length === 0) {
    return { evidenceScore: 50, safetyScore: 75, overallScore: 60 };
  }

  // 検出された成分のスコアを平均
  let totalEvidence = 0;
  let totalSafety = 0;

  for (const ing of foundIngredients) {
    // エビデンススコア（S=95, A=85, B=70, C=55, D=40）
    const evidenceMap = { S: 95, A: 85, B: 70, C: 55, D: 40 };
    totalEvidence += evidenceMap[ing.evidenceLevel] || 50;

    // 安全性スコア（S=95, A=85, B=75, C=60, D=40）
    const safetyMap = { S: 95, A: 85, B: 75, C: 60, D: 40 };
    totalSafety += safetyMap[ing.safetyLevel] || 75;
  }

  const evidenceScore = Math.round(totalEvidence / foundIngredients.length);
  const safetyScore = Math.round(totalSafety / foundIngredients.length);
  const overallScore = Math.round((evidenceScore + safetyScore) / 2);

  return { evidenceScore, safetyScore, overallScore };
}

/**
 * 配合率ベースでエビデンススコアを計算
 */
function calculateEvidenceScoreByRatio(ingredientsWithAmount) {
  if (!ingredientsWithAmount || ingredientsWithAmount.length === 0) {
    return 50;
  }

  let totalScore = 0;
  let totalAmount = 0;

  const evidenceMap = { S: 95, A: 85, B: 70, C: 55, D: 40 };

  for (const { ingredient, amountMg } of ingredientsWithAmount) {
    const evidenceScore = evidenceMap[ingredient.evidenceLevel] || 50;
    totalScore += evidenceScore * amountMg;
    totalAmount += amountMg;
  }

  return totalAmount > 0 ? Math.round(totalScore / totalAmount) : 50;
}

/**
 * 配合率ベースで安全性スコアを計算
 */
function calculateSafetyScoreByRatio(ingredientsWithAmount) {
  if (!ingredientsWithAmount || ingredientsWithAmount.length === 0) {
    return 75;
  }

  let totalScore = 0;
  let totalAmount = 0;

  const safetyMap = { S: 95, A: 85, B: 75, C: 60, D: 40 };

  for (const { ingredient, amountMg } of ingredientsWithAmount) {
    const safetyScore = safetyMap[ingredient.safetyLevel] || 75;
    totalScore += safetyScore * amountMg;
    totalAmount += amountMg;
  }

  return totalAmount > 0 ? Math.round(totalScore / totalAmount) : 75;
}

async function main() {
  console.log("📊 商品スコアの自動計算を開始します...");

  // 全成分を取得
  const allIngredients = await client.fetch(`
    *[_type == "ingredient"]{
      _id,
      name,
      nameEn,
      aliases,
      evidenceLevel,
      safetyLevel
    }
  `);

  console.log(`✅ ${allIngredients.length}件の成分データを取得しました`);

  // 全商品を取得
  const allProducts = await client.fetch(`
    *[_type == "product"]{
      _id,
      name,
      scores,
      ingredients[]{
        ingredient->{
          _id,
          name,
          nameEn,
          aliases,
          evidenceLevel,
          safetyLevel
        },
        amountMgPerServing
      }
    }
  `);

  console.log(`✅ ${allProducts.length}件の商品データを取得しました\n`);

  let updatedCount = 0;
  let skippedCount = 0;

  for (const product of allProducts) {
    // 既にscoresが設定されている場合はスキップ
    if (product.scores?.evidence && product.scores?.safety) {
      console.log(`⏭️  スキップ: ${product.name}（既にスコア設定済み）`);
      skippedCount++;
      continue;
    }

    let evidenceScore = 50;
    let safetyScore = 75;

    // 成分データがある場合は配合率ベースで計算
    const hasValidIngredients =
      product.ingredients &&
      product.ingredients.length > 0 &&
      product.ingredients.every(
        (ing) => ing.ingredient && ing.amountMgPerServing > 0
      );

    if (hasValidIngredients) {
      const ingredientsWithAmount = product.ingredients.map((ing) => ({
        ingredient: ing.ingredient,
        amountMg: ing.amountMgPerServing,
      }));

      evidenceScore = calculateEvidenceScoreByRatio(ingredientsWithAmount);
      safetyScore = calculateSafetyScoreByRatio(ingredientsWithAmount);

      console.log(
        `✅ 配合率ベース計算: ${product.name} (evidence=${evidenceScore}, safety=${safetyScore})`
      );
    } else {
      // フォールバック: 商品名から推測
      const autoScores = calculateAutoScores(product.name, allIngredients);
      evidenceScore = autoScores.evidenceScore;
      safetyScore = autoScores.safetyScore;

      console.log(
        `⚠️  商品名ベース計算: ${product.name} (evidence=${evidenceScore}, safety=${safetyScore})`
      );
    }

    const overallScore = Math.round((evidenceScore + safetyScore) / 2);

    // Sanityに更新
    try {
      await client
        .patch(product._id)
        .set({
          scores: {
            evidence: evidenceScore,
            safety: safetyScore,
            overall: overallScore,
          },
        })
        .commit();

      console.log(`  ✔️  Sanityに保存しました\n`);
      updatedCount++;
    } catch (error) {
      console.error(`  ❌ エラー: ${error.message}\n`);
    }
  }

  console.log("\n🎉 完了しました！");
  console.log(`  更新: ${updatedCount}件`);
  console.log(`  スキップ: ${skippedCount}件`);
  console.log(`  合計: ${allProducts.length}件`);
}

main().catch((error) => {
  console.error("❌ エラーが発生しました:", error);
  process.exit(1);
});
