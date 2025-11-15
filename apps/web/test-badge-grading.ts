#!/usr/bin/env node
/**
 * Nutrition Score Badge Grading Test
 *
 * Tests the grade assignment logic with normalized scores
 */

import { calculateNutritionScore } from "./src/lib/nutrition-score";

// Grade determination function (from component)
function getGradeFromScore(score: number): string {
  if (score >= 90) return "S";
  if (score >= 75) return "A";
  if (score >= 60) return "B";
  if (score >= 45) return "C";
  return "D";
}

console.log("=".repeat(80));
console.log("Nutrition Score Badge - Grading Test");
console.log("=".repeat(80));
console.log();

// Test Case 1: High-quality multivitamin (should be S or A)
console.log("Test Case 1: High-quality multivitamin");
console.log("-".repeat(80));
const highQuality = [
  { name: "ビタミンC", amount: 100, evidenceLevel: "A" }, // 100% RDA, 80 score
  { name: "ビタミンD", amount: 0.0085, evidenceLevel: "A" }, // 100% RDA, 80 score
  { name: "ビタミンE", amount: 6, evidenceLevel: "B" }, // 100% RDA, 60 score
];

const result1 = calculateNutritionScore(highQuality, "male");
const normalized1 =
  result1.ingredientScores.length > 0
    ? result1.totalScore / result1.ingredientScores.length
    : 0;
const grade1 = getGradeFromScore(normalized1);

console.log(`  Total Score: ${result1.totalScore.toFixed(1)}`);
console.log(`  Ingredient Count: ${result1.ingredientScores.length}`);
console.log(`  Normalized Score: ${normalized1.toFixed(1)}`);
console.log(`  Grade: ${grade1}`);
console.log(
  `  Expected: A or B (average ~73.3) ${grade1 === "A" || grade1 === "B" ? "✅" : "❌"}`,
);
console.log();

// Test Case 2: Premium supplement (all S evidence)
console.log("Test Case 2: Premium supplement (all S evidence)");
console.log("-".repeat(80));
const premium = [
  { name: "ビタミンC", amount: 100, evidenceLevel: "S" }, // 100% RDA, 100 score
  { name: "ビタミンD", amount: 0.0085, evidenceLevel: "S" }, // 100% RDA, 100 score
  { name: "ビタミンE", amount: 6, evidenceLevel: "S" }, // 100% RDA, 100 score
];

const result2 = calculateNutritionScore(premium, "male");
const normalized2 =
  result2.ingredientScores.length > 0
    ? result2.totalScore / result2.ingredientScores.length
    : 0;
const grade2 = getGradeFromScore(normalized2);

console.log(`  Total Score: ${result2.totalScore.toFixed(1)}`);
console.log(`  Ingredient Count: ${result2.ingredientScores.length}`);
console.log(`  Normalized Score: ${normalized2.toFixed(1)}`);
console.log(`  Grade: ${grade2}`);
console.log(`  Expected: S (100.0) ${grade2 === "S" ? "✅" : "❌"}`);
console.log();

// Test Case 3: Low dosage supplement
console.log("Test Case 3: Low dosage supplement (50% RDA)");
console.log("-".repeat(80));
const lowDosage = [
  { name: "ビタミンC", amount: 50, evidenceLevel: "A" }, // 50% RDA, 40 score
  { name: "ビタミンD", amount: 0.00425, evidenceLevel: "A" }, // 50% RDA, 40 score
];

const result3 = calculateNutritionScore(lowDosage, "male");
const normalized3 =
  result3.ingredientScores.length > 0
    ? result3.totalScore / result3.ingredientScores.length
    : 0;
const grade3 = getGradeFromScore(normalized3);

console.log(`  Total Score: ${result3.totalScore.toFixed(1)}`);
console.log(`  Ingredient Count: ${result3.ingredientScores.length}`);
console.log(`  Normalized Score: ${normalized3.toFixed(1)}`);
console.log(`  Grade: ${grade3}`);
console.log(
  `  Expected: C or D (40.0) ${grade3 === "C" || grade3 === "D" ? "✅" : "❌"}`,
);
console.log();

// Test Case 4: Verify fairness (3 ingredients vs 9 ingredients)
console.log("Test Case 4: Fairness test (3 vs 9 ingredients, same quality)");
console.log("-".repeat(80));

const product3Ingredients = [
  { name: "ビタミンC", amount: 100, evidenceLevel: "A" },
  { name: "ビタミンD", amount: 0.0085, evidenceLevel: "A" },
  { name: "ビタミンE", amount: 6, evidenceLevel: "A" },
];

const product9Ingredients = [
  { name: "ビタミンC", amount: 100, evidenceLevel: "A" },
  { name: "ビタミンD", amount: 0.0085, evidenceLevel: "A" },
  { name: "ビタミンE", amount: 6, evidenceLevel: "A" },
  { name: "ビタミンB1", amount: 1.4, evidenceLevel: "A" },
  { name: "ビタミンB2", amount: 1.6, evidenceLevel: "A" },
  { name: "ビタミンB6", amount: 1.4, evidenceLevel: "A" },
  { name: "ビタミンB12", amount: 0.0024, evidenceLevel: "A" },
  { name: "葉酸", amount: 0.24, evidenceLevel: "A" },
  { name: "ナイアシン", amount: 15, evidenceLevel: "A" },
];

const result4a = calculateNutritionScore(product3Ingredients, "male");
const normalized4a =
  result4a.ingredientScores.length > 0
    ? result4a.totalScore / result4a.ingredientScores.length
    : 0;

const result4b = calculateNutritionScore(product9Ingredients, "male");
const normalized4b =
  result4b.ingredientScores.length > 0
    ? result4b.totalScore / result4b.ingredientScores.length
    : 0;

console.log(`  3 ingredients:`);
console.log(`    Total Score: ${result4a.totalScore.toFixed(1)}`);
console.log(`    Normalized: ${normalized4a.toFixed(1)}`);
console.log(`    Grade: ${getGradeFromScore(normalized4a)}`);
console.log();
console.log(`  9 ingredients:`);
console.log(`    Total Score: ${result4b.totalScore.toFixed(1)}`);
console.log(`    Normalized: ${normalized4b.toFixed(1)}`);
console.log(`    Grade: ${getGradeFromScore(normalized4b)}`);
console.log();
console.log(
  `  Fairness check: ${Math.abs(normalized4a - normalized4b) < 5 ? "✅ Similar grades (fair)" : "❌ Different grades (unfair)"}`,
);
console.log();

// Grade threshold verification
console.log("Test Case 5: Grade threshold verification");
console.log("-".repeat(80));
const thresholds = [
  { score: 95, expected: "S" },
  { score: 90, expected: "S" },
  { score: 89, expected: "A" },
  { score: 75, expected: "A" },
  { score: 74, expected: "B" },
  { score: 60, expected: "B" },
  { score: 59, expected: "C" },
  { score: 45, expected: "C" },
  { score: 44, expected: "D" },
  { score: 30, expected: "D" },
];

let passed = 0;
for (const t of thresholds) {
  const grade = getGradeFromScore(t.score);
  const match = grade === t.expected;
  if (match) passed++;
  console.log(
    `  Score ${t.score}: ${grade} (expected ${t.expected}) ${match ? "✅" : "❌"}`,
  );
}
console.log();
console.log(`  Result: ${passed}/${thresholds.length} passed`);
console.log();

console.log("=".repeat(80));
console.log("✅ Badge grading test completed!");
console.log("=".repeat(80));
