#!/usr/bin/env node
/**
 * Nutrition Score Test Script
 *
 * Purpose: Test nutrition score calculation logic with sample supplement data
 *
 * Test Cases:
 * 1. Simple multivitamin (ビタミンC、ビタミンD、ビタミンE)
 * 2. BCAA supplement (ロイシン、イソロイシン、バリン)
 * 3. Complex multivitamin + mineral (ビタミンB群、ミネラル)
 * 4. Excessive dosage warning (UL check)
 */

import {
  calculateNutritionScore,
  calculateRdaFulfillment,
  exceedsTolerableUpperLimit,
  getSafetyLevel,
  evidenceLevelToScore,
} from "./src/lib/nutrition-score";

console.log("=".repeat(80));
console.log("Nutrition Score Calculator - Test Script");
console.log("=".repeat(80));
console.log();

// Test Case 1: Simple Multivitamin
console.log("📦 Test Case 1: Simple Multivitamin");
console.log("-".repeat(80));

const simpleMultivitamin = [
  { name: "ビタミンC", amount: 100, evidenceLevel: "A" }, // RDA: 100mg → 100%
  { name: "ビタミンD", amount: 0.025, evidenceLevel: "A" }, // RDA: 0.0085mg → 294%
  { name: "ビタミンE", amount: 12, evidenceLevel: "B" }, // RDA: 6mg → 200%
];

const result1 = calculateNutritionScore(simpleMultivitamin, "male");

console.log(`  Total Score: ${result1.totalScore.toFixed(1)}`);
console.log(`  Ingredients:`);
for (const ing of result1.ingredientScores) {
  console.log(`    - ${ing.name}:`);
  console.log(`        RDA Fulfillment: ${ing.rdaFulfillment.toFixed(1)}%`);
  console.log(`        Evidence Score: ${ing.evidenceScore}`);
  console.log(`        Contribution: ${ing.contributionScore.toFixed(1)}`);
}
console.log();

// Test Case 2: BCAA Supplement
console.log("📦 Test Case 2: BCAA Supplement (5000mg)");
console.log("-".repeat(80));

const bcaaSupplement = [
  { name: "ロイシン", amount: 2500, evidenceLevel: "A" }, // RDA: 2340mg → 100%（キャップ）
  { name: "イソロイシン", amount: 1250, evidenceLevel: "A" }, // RDA: 1260mg → 99.2%
  { name: "バリン", amount: 1250, evidenceLevel: "A" }, // RDA: 1560mg → 80.1%
];

const result2 = calculateNutritionScore(bcaaSupplement, "male");

console.log(`  Total Score: ${result2.totalScore.toFixed(1)}`);
console.log(`  Ingredients:`);
for (const ing of result2.ingredientScores) {
  console.log(`    - ${ing.name}:`);
  console.log(`        RDA Fulfillment: ${ing.rdaFulfillment.toFixed(1)}%`);
  console.log(`        Evidence Score: ${ing.evidenceScore}`);
  console.log(`        Contribution: ${ing.contributionScore.toFixed(1)}`);
}
console.log();

// Test Case 3: Complex Multivitamin + Mineral
console.log("📦 Test Case 3: Complex Multivitamin + Mineral");
console.log("-".repeat(80));

const complexMultivitamin = [
  { name: "ビタミンB1", amount: 1.4, evidenceLevel: "A" },
  { name: "ビタミンB2", amount: 1.6, evidenceLevel: "A" },
  { name: "ビタミンB6", amount: 1.4, evidenceLevel: "A" },
  { name: "ビタミンB12", amount: 0.0024, evidenceLevel: "A" },
  { name: "葉酸", amount: 0.24, evidenceLevel: "S" },
  { name: "ビタミンC", amount: 100, evidenceLevel: "A" },
  { name: "カルシウム", amount: 400, evidenceLevel: "A" }, // RDA: 800mg → 50%
  { name: "鉄", amount: 7.5, evidenceLevel: "A" }, // RDA: 7.5mg → 100%
  { name: "亜鉛", amount: 11, evidenceLevel: "A" }, // RDA: 11mg → 100%
];

const result3 = calculateNutritionScore(complexMultivitamin, "male");

console.log(`  Total Score: ${result3.totalScore.toFixed(1)}`);
console.log(`  Category Scores:`);
for (const [category, data] of Object.entries(result3.categoryScores)) {
  console.log(
    `    - ${category}: ${data.averageScore.toFixed(1)} (${data.count} ingredients)`,
  );
}
console.log();

// Test Case 4: Safety Level Checks
console.log("📦 Test Case 4: Safety Level Checks");
console.log("-".repeat(80));

const safetyTestCases = [
  { name: "ビタミンC", amount: 40, expected: "deficient" }, // < 50% RDA
  { name: "ビタミンC", amount: 75, expected: "adequate" }, // 50-100% RDA
  { name: "ビタミンC", amount: 100, expected: "optimal" }, // 100% RDA
  { name: "ビタミンC", amount: 150, expected: "optimal" }, // 150% RDA
  { name: "ビタミンC", amount: 200, expected: "high" }, // > 150% RDA
  { name: "ビタミンE", amount: 800, expected: "excessive" }, // > UL (750mg)
];

for (const test of safetyTestCases) {
  const level = getSafetyLevel(test.name, test.amount, "male");
  const fulfillment = calculateRdaFulfillment(test.name, test.amount, "male");
  const exceedsUL = exceedsTolerableUpperLimit(test.name, test.amount);

  console.log(`  ${test.name} (${test.amount}mg):`);
  console.log(`    RDA Fulfillment: ${fulfillment?.toFixed(1)}%`);
  console.log(`    Safety Level: ${level}`);
  console.log(
    `    Exceeds UL: ${exceedsUL === null ? "N/A" : exceedsUL ? "Yes" : "No"}`,
  );
  console.log(
    `    Expected: ${test.expected} ${level === test.expected ? "✅" : "❌"}`,
  );
  console.log();
}

// Test Case 5: Evidence Level Conversion
console.log("📦 Test Case 5: Evidence Level to Score Conversion");
console.log("-".repeat(80));

const evidenceLevels = ["S", "A", "B", "C", "D"];
for (const level of evidenceLevels) {
  const score = evidenceLevelToScore(level);
  console.log(`  ${level}: ${score} points`);
}
console.log();

console.log("=".repeat(80));
console.log("✅ All tests completed!");
console.log("=".repeat(80));
