#!/usr/bin/env node
import { createClient } from "@sanity/client";
import "dotenv/config";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

/**
 * evidenceLevelをスコアに変換
 */
function evidenceLevelToScore(level) {
  switch (level) {
    case "S": return 95;
    case "A": return 85;
    case "B": return 75;
    case "C": return 65;
    case "D": return 55;
    default: return 50;
  }
}

/**
 * safetyLevelをスコアに変換
 */
function safetyLevelToScore(level) {
  switch (level) {
    case "S": return 100;
    case "A": return 90;
    case "B": return 80;
    case "C": return 70;
    case "D": return 60;
    default: return 75;
  }
}

// DHC商品のデータを取得
const dhcProduct = await client.fetch(`
  *[_type == "product" && slug.current == "p-18-dhc-c-90-c-b2-dhc-c-b2-90-vc-well"][0]{
    name,
    slug,
    servingsPerDay,
    ingredients[]{
      amountMgPerServing,
      ingredient->{
        _id,
        name,
        evidenceLevel,
        safetyLevel
      }
    }
  }
`);

console.log("📦 DHC商品データ:\n");
console.log(`商品名: ${dhcProduct.name.substring(0, 80)}...`);
console.log(`摂取回数: ${dhcProduct.servingsPerDay}回/日\n`);

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("📊 成分詳細:");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

let totalDailyAmount = 0;
const ingredientData = [];

for (const ing of dhcProduct.ingredients) {
  const dailyAmount = ing.amountMgPerServing * dhcProduct.servingsPerDay;
  totalDailyAmount += dailyAmount;

  const evidenceScore = evidenceLevelToScore(ing.ingredient.evidenceLevel);
  const safetyScore = safetyLevelToScore(ing.ingredient.safetyLevel);

  ingredientData.push({
    name: ing.ingredient.name,
    amountPerServing: ing.amountMgPerServing,
    dailyAmount,
    evidenceLevel: ing.ingredient.evidenceLevel,
    evidenceScore,
    safetyLevel: ing.ingredient.safetyLevel,
    safetyScore,
  });

  console.log(`${ing.ingredient.name}:`);
  console.log(`  量: ${ing.amountMgPerServing}mg/回 × ${dhcProduct.servingsPerDay}回 = ${dailyAmount}mg/日`);
  console.log(`  エビデンス: ${ing.ingredient.evidenceLevel} → ${evidenceScore}点`);
  console.log(`  安全性: ${ing.ingredient.safetyLevel} → ${safetyScore}点`);
  console.log('');
}

console.log(`合計配合量: ${totalDailyAmount}mg/日\n`);

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("🧮 加重平均計算:");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

let weightedEvidenceScore = 0;
let weightedSafetyScore = 0;

for (const ing of ingredientData) {
  const weight = ing.dailyAmount / totalDailyAmount;
  const weightPercent = (weight * 100).toFixed(2);

  console.log(`${ing.name}:`);
  console.log(`  重み: ${ing.dailyAmount}mg / ${totalDailyAmount}mg = ${weightPercent}%`);
  console.log(`  エビデンス寄与: ${ing.evidenceScore} × ${weightPercent}% = ${(ing.evidenceScore * weight).toFixed(2)}点`);
  console.log(`  安全性寄与: ${ing.safetyScore} × ${weightPercent}% = ${(ing.safetyScore * weight).toFixed(2)}点`);
  console.log('');

  weightedEvidenceScore += ing.evidenceScore * weight;
  weightedSafetyScore += ing.safetyScore * weight;
}

const evidenceScore = Math.round(weightedEvidenceScore * 100) / 100;
const safetyScore = Math.round(weightedSafetyScore * 100) / 100;
const overall = Math.round((evidenceScore + safetyScore) / 2);

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("✅ 最終スコア:");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
console.log(`エビデンススコア: ${evidenceScore}点`);
console.log(`安全性スコア: ${safetyScore}点`);
console.log(`総合スコア: ${overall}点\n`);

console.log("🎯 期待値との比較:");
console.log(`エビデンス: 期待値 95点 → 実際 ${evidenceScore}点 ${Math.abs(evidenceScore - 95) < 1 ? '✅' : '❌'}`);
console.log(`安全性: 期待値 100点 → 実際 ${safetyScore}点 ${Math.abs(safetyScore - 100) < 1 ? '✅' : '❌'}`);
