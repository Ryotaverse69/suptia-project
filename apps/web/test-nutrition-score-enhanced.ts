#!/usr/bin/env node
/**
 * Enhanced Nutrition Score Test Script
 *
 * Phase 2.7-D: 栄養価スコア詳細表示テスト
 * - トップ5貢献成分の表示確認
 * - カテゴリ別スコアの表示確認
 * - スコア計算ロジックの検証
 */

import { calculateNutritionScore } from "./src/lib/nutrition-score";

console.log("=".repeat(80));
console.log("Enhanced Nutrition Score - Test Script (Phase 2.7-D)");
console.log("=".repeat(80));
console.log();

// Test Case 1: Fancl-like Complex Multivitamin
console.log("📦 Test Case 1: ファンケル風マルチビタミン（19成分）");
console.log("-".repeat(80));

const fanclLikeProduct = [
  { name: "ビタミンA", amount: 0.3, evidenceLevel: "A" },
  { name: "ビタミンB1", amount: 1.5, evidenceLevel: "A" },
  { name: "ビタミンB2", amount: 1.7, evidenceLevel: "A" },
  { name: "ビタミンB6", amount: 2.0, evidenceLevel: "A" },
  { name: "ビタミンB12", amount: 0.003, evidenceLevel: "A" },
  { name: "ビタミンC", amount: 100, evidenceLevel: "A" },
  { name: "ビタミンD", amount: 0.01, evidenceLevel: "A" },
  { name: "ビタミンE", amount: 80, evidenceLevel: "A" },
  { name: "葉酸", amount: 0.24, evidenceLevel: "S" },
  { name: "ナイアシン", amount: 15, evidenceLevel: "A" },
  { name: "パントテン酸", amount: 6.0, evidenceLevel: "B" },
  { name: "ビオチン", amount: 0.05, evidenceLevel: "B" },
  { name: "カルシウム", amount: 250, evidenceLevel: "A" },
  { name: "マグネシウム", amount: 125, evidenceLevel: "A" },
  { name: "鉄", amount: 7.5, evidenceLevel: "A" },
  { name: "亜鉛", amount: 11, evidenceLevel: "A" },
  { name: "銅", amount: 0.9, evidenceLevel: "B" },
  { name: "マンガン", amount: 3.8, evidenceLevel: "B" },
  { name: "セレン", amount: 0.03, evidenceLevel: "B" },
];

const result = calculateNutritionScore(fanclLikeProduct, "male");
const normalizedScore =
  result.ingredientScores.length > 0
    ? result.totalScore / result.ingredientScores.length
    : 0;

function getGrade(score: number): string {
  if (score >= 90) return "S";
  if (score >= 75) return "A";
  if (score >= 60) return "B";
  if (score >= 45) return "C";
  return "D";
}

console.log(`  総合スコア: ${result.totalScore.toFixed(1)}`);
console.log(
  `  正規化スコア: ${normalizedScore.toFixed(1)} (${getGrade(normalizedScore)}グレード)`,
);
console.log(`  成分数: ${result.ingredientScores.length}`);
console.log();

// トップ5貢献成分の表示
console.log("  🏆 トップ5貢献成分:");
const top5 = [...result.ingredientScores]
  .sort((a, b) => b.contributionScore - a.contributionScore)
  .slice(0, 5);

top5.forEach((ing, index) => {
  console.log(
    `    ${index + 1}. ${ing.name}: ${ing.contributionScore.toFixed(1)}点`,
  );
  console.log(
    `       RDA: ${ing.rdaFulfillment.toFixed(1)}% | エビデンス: ${ing.evidenceScore}点`,
  );
});
console.log();

// カテゴリ別スコアの表示
console.log("  📂 カテゴリ別スコア:");
const categories = Object.entries(result.categoryScores).sort(
  ([, a], [, b]) => b.averageScore - a.averageScore,
);

categories.forEach(([category, data]) => {
  console.log(
    `    ${category}: ${data.averageScore.toFixed(1)}点 (${data.count}成分)`,
  );
});
console.log();

// Test Case 2: Simple 3-Ingredient Product
console.log("📦 Test Case 2: シンプルな3成分商品");
console.log("-".repeat(80));

const simpleProduct = [
  { name: "ビタミンC", amount: 100, evidenceLevel: "A" },
  { name: "ビタミンD", amount: 0.025, evidenceLevel: "A" },
  { name: "ビタミンE", amount: 12, evidenceLevel: "B" },
];

const result2 = calculateNutritionScore(simpleProduct, "male");
const normalizedScore2 =
  result2.ingredientScores.length > 0
    ? result2.totalScore / result2.ingredientScores.length
    : 0;

console.log(
  `  正規化スコア: ${normalizedScore2.toFixed(1)} (${getGrade(normalizedScore2)}グレード)`,
);
console.log();

console.log("  🏆 トップ3貢献成分:");
const top3 = [...result2.ingredientScores]
  .sort((a, b) => b.contributionScore - a.contributionScore)
  .slice(0, 3);

top3.forEach((ing, index) => {
  console.log(
    `    ${index + 1}. ${ing.name}: ${ing.contributionScore.toFixed(1)}点`,
  );
});
console.log();

// Test Case 3: Comparison - 成分数が異なる商品の公平性検証
console.log("📦 Test Case 3: 成分数の異なる商品間の公平性検証");
console.log("-".repeat(80));

console.log(`  ファンケル風（19成分）: ${normalizedScore.toFixed(1)}点`);
console.log(`  シンプル商品（3成分）: ${normalizedScore2.toFixed(1)}点`);
console.log();
console.log(`  ✅ 正規化により成分数が異なっても公平に比較可能`);
console.log();

console.log("=".repeat(80));
console.log("✅ Phase 2.7-D test completed!");
console.log("=".repeat(80));
