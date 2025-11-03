/**
 * mitete商品のスコアを再計算するスクリプト
 * 成分の安全性レベル更新後に実行
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
  console.log("📊 mitete商品のスコアを再計算します...\n");

  // mitete商品を取得
  const product = await client.fetch(`
    *[_type == "product" && _id == "product-rakuten-afc-10002396"][0]{
      _id,
      name,
      scores,
      ingredients[]{
        ingredient->{
          _id,
          name,
          nameEn,
          evidenceLevel,
          safetyLevel
        },
        amountMgPerServing
      }
    }
  `);

  if (!product) {
    console.error("❌ mitete商品が見つかりません");
    process.exit(1);
  }

  console.log(`商品名: ${product.name}`);
  console.log(`現在のスコア:`, product.scores);
  console.log(`\n成分情報:`);

  const ingredientsWithAmount = product.ingredients.map((ing) => {
    console.log(`  - ${ing.ingredient.name}: ${ing.amountMgPerServing}mg`);
    console.log(`    エビデンスレベル: ${ing.ingredient.evidenceLevel}`);
    console.log(`    安全性レベル: ${ing.ingredient.safetyLevel}`);
    return {
      ingredient: ing.ingredient,
      amountMg: ing.amountMgPerServing,
    };
  });

  const evidenceScore = calculateEvidenceScoreByRatio(ingredientsWithAmount);
  const safetyScore = calculateSafetyScoreByRatio(ingredientsWithAmount);
  const overallScore = Math.round((evidenceScore + safetyScore) / 2);

  console.log(`\n✨ 新しいスコア:`);
  console.log(`  エビデンス: ${evidenceScore} (${getScoreLevel(evidenceScore)}ランク)`);
  console.log(`  安全性: ${safetyScore} (${getScoreLevel(safetyScore)}ランク)`);
  console.log(`  総合: ${overallScore}`);

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

    console.log(`\n✅ Sanityに保存しました！`);
    console.log(`\n🏆 期待されるバッジ:`);
    console.log(`  - 🔬 エビデンスS (${evidenceScore >= 90 ? "✓" : "✗"})`);
    console.log(`  - 🛡️ 高安全性 (${safetyScore >= 90 ? "✓" : "✗"})`);
  } catch (error) {
    console.error(`❌ エラー: ${error.message}`);
  }
}

function getScoreLevel(score) {
  if (score >= 90) return "S";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  return "D";
}

main().catch((error) => {
  console.error("❌ エラーが発生しました:", error);
  process.exit(1);
});
