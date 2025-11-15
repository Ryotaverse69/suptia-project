#!/usr/bin/env node
/**
 * Phase 1 Improvements Test Script
 *
 * Tests:
 * 1. UL warning for excessive Vitamin E (>750mg)
 * 2. Comparison basis banner display
 * 3. Integration with nutrition score and RDA fulfillment
 */

import {
  exceedsTolerableUpperLimit,
  calculateNutritionScore,
} from "./src/lib/nutrition-score";

console.log("=".repeat(80));
console.log("Phase 1 Improvements - Test Script");
console.log("=".repeat(80));
console.log();

// Test Case 1: UL Warning for Vitamin E
console.log("Test Case 1: UL Warning for Vitamin E");
console.log("-".repeat(80));

const vitaminETestCases = [
  { amount: 240, expected: false, description: "Normal dose (Fancl product)" },
  { amount: 12.6, expected: false, description: "Low dose (Kiwami product)" },
  { amount: 800, expected: true, description: "Exceeds UL (800mg)" },
  { amount: 1000, expected: true, description: "High excess (1000mg)" },
  { amount: 650, expected: false, description: "Below UL (650mg)" },
];

for (const test of vitaminETestCases) {
  const exceedsUL = exceedsTolerableUpperLimit("ビタミンE", test.amount);
  const status = exceedsUL === test.expected ? "✅" : "❌";
  console.log(`  ${test.description}:`);
  console.log(`    Amount: ${test.amount}mg/日`);
  console.log(
    `    Exceeds UL: ${exceedsUL === null ? "N/A" : exceedsUL ? "Yes" : "No"}`,
  );
  console.log(`    Expected: ${test.expected ? "Yes" : "No"} ${status}`);
  console.log();
}

// Test Case 2: Multi-vitamin Nutrition Score
console.log("Test Case 2: Multi-vitamin Nutrition Score (Fancl-like product)");
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

function getGradeFromScore(score: number): string {
  if (score >= 90) return "S";
  if (score >= 75) return "A";
  if (score >= 60) return "B";
  if (score >= 45) return "C";
  return "D";
}

const grade = getGradeFromScore(normalizedScore);

console.log(`  Total ingredients: ${fanclLikeProduct.length}`);
console.log(`  Total Score: ${result.totalScore.toFixed(1)}`);
console.log(`  Normalized Score: ${normalizedScore.toFixed(1)}`);
console.log(`  Grade: ${grade}`);
console.log(`  Expected: A or B (comprehensive multivitamin)`);
console.log();

// Display top 5 ingredients by contribution
console.log("  Top 5 Contributing Ingredients:");
const sortedByContribution = [...result.ingredientScores]
  .sort((a, b) => b.contributionScore - a.contributionScore)
  .slice(0, 5);

sortedByContribution.forEach((ing, index) => {
  console.log(
    `    ${index + 1}. ${ing.name}: ${ing.contributionScore.toFixed(1)} points`,
  );
  console.log(
    `       (RDA: ${ing.rdaFulfillment.toFixed(1)}%, Evidence: ${ing.evidenceScore})`,
  );
});
console.log();

// Test Case 3: Comparison Basis Banner Context
console.log("Test Case 3: Comparison Basis Banner Simulation");
console.log("-".repeat(80));

const comparisonScenarios = [
  { ingredientName: "ビタミンC", productCount: 5, currentAmount: 100 },
  { ingredientName: "ビタミンE", productCount: 3, currentAmount: 80 },
  { ingredientName: "カルシウム", productCount: 8, currentAmount: 250 },
];

for (const scenario of comparisonScenarios) {
  console.log(`  Ingredient: ${scenario.ingredientName}`);
  console.log(
    `  Banner: "💡 この比較は ${scenario.ingredientName} の1日あたりの含有量を基準に行っています`,
  );
  console.log(`           （${scenario.productCount}商品を比較）"`);
  console.log(`  Current product amount: ${scenario.currentAmount}mg/日`);

  const exceedsUL = exceedsTolerableUpperLimit(
    scenario.ingredientName,
    scenario.currentAmount,
  );
  if (exceedsUL) {
    console.log(`  ⚠️  UL警告表示: Yes`);
  } else {
    console.log(`  ⚠️  UL警告表示: No`);
  }
  console.log();
}

console.log("=".repeat(80));
console.log("✅ Phase 1 improvements test completed!");
console.log("=".repeat(80));
