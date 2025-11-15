#!/usr/bin/env node
/**
 * Safety-Integrated Badge Logic Test Script
 *
 * Purpose: Test badge determination with safety checks
 *
 * Test Cases:
 * 1. Normal range (should get S badge)
 * 2. UL exceeded (should get warning instead of S badge)
 * 3. Excessive but below UL (should get S badge with warning)
 * 4. Deficient (should get lower badge with warning)
 * 5. Product safety evaluation
 */

import {
  determineContentBadgeWithSafety,
  calculateSafetyScore,
  extractWarningIngredients,
  evaluateProductSafety,
} from "./src/lib/safety-integrated-badges";

console.log("=".repeat(80));
console.log("Safety-Integrated Badge Logic - Test Script");
console.log("=".repeat(80));
console.log();

// Test Case 1: Normal range (should get S badge)
console.log("📦 Test Case 1: Normal Range - Highest Content");
console.log("-".repeat(80));

const normalIngredient = {
  name: "ビタミンC",
  amount: 1000, // RDA: 100mg (10x), UL: なし
  rankInGroup: 1,
  totalInGroup: 10,
};

const result1 = determineContentBadgeWithSafety(normalIngredient);
console.log(
  `  Ingredient: ${normalIngredient.name} (${normalIngredient.amount}mg)`,
);
console.log(`  Badge: ${result1.badge}`);
console.log(`  Message: ${result1.message}`);
console.log(`  Has Warning: ${result1.hasWarning}`);
console.log(`  Safety Level: ${result1.safetyLevel}`);
if (result1.warningDetails) {
  console.log(`  Warning: ${result1.warningDetails.recommendation}`);
}
console.log();

// Test Case 2: UL exceeded (should get warning instead of S badge)
console.log("📦 Test Case 2: UL Exceeded - Warning Instead of S Badge");
console.log("-".repeat(80));

const ulExceededIngredient = {
  name: "ビタミンE",
  amount: 800, // RDA: 6mg, UL: 750mg (超過!)
  rankInGroup: 1,
  totalInGroup: 10,
};

const result2 = determineContentBadgeWithSafety(ulExceededIngredient);
console.log(
  `  Ingredient: ${ulExceededIngredient.name} (${ulExceededIngredient.amount}mg)`,
);
console.log(
  `  Badge: ${result2.badge} ${result2.badge === "warning" ? "✅" : "❌ (Expected: warning)"}`,
);
console.log(`  Message: ${result2.message}`);
console.log(`  Has Warning: ${result2.hasWarning}`);
console.log(`  Safety Level: ${result2.safetyLevel}`);
if (result2.warningDetails) {
  console.log(`  Warning Severity: ${result2.warningDetails.severity}`);
  console.log(`  Recommendation: ${result2.warningDetails.recommendation}`);
}
console.log();

// Test Case 3: Excessive but below UL (should get S badge with warning)
console.log("📦 Test Case 3: Excessive but Below UL - S Badge with Warning");
console.log("-".repeat(80));

const excessiveIngredient = {
  name: "ビタミンE",
  amount: 300, // RDA: 6mg (50x), UL: 750mg (未超過)
  rankInGroup: 1,
  totalInGroup: 10,
};

const result3 = determineContentBadgeWithSafety(excessiveIngredient);
console.log(
  `  Ingredient: ${excessiveIngredient.name} (${excessiveIngredient.amount}mg)`,
);
console.log(
  `  Badge: ${result3.badge} ${result3.badge === "S" ? "✅" : "❌ (Expected: S)"}`,
);
console.log(`  Message: ${result3.message}`);
console.log(
  `  Has Warning: ${result3.hasWarning} ${result3.hasWarning ? "✅" : "❌ (Expected: true)"}`,
);
console.log(`  Safety Level: ${result3.safetyLevel}`);
if (result3.warningDetails) {
  console.log(`  Warning Severity: ${result3.warningDetails.severity}`);
  console.log(`  Recommendation: ${result3.warningDetails.recommendation}`);
}
console.log();

// Test Case 4: Deficient (should get lower badge with warning)
console.log("📦 Test Case 4: Deficient - Lower Badge with Warning");
console.log("-".repeat(80));

const deficientIngredient = {
  name: "ビタミンC",
  amount: 30, // RDA: 100mg (30% - deficient)
  rankInGroup: 5,
  totalInGroup: 10,
};

const result4 = determineContentBadgeWithSafety(deficientIngredient);
console.log(
  `  Ingredient: ${deficientIngredient.name} (${deficientIngredient.amount}mg)`,
);
console.log(`  Badge: ${result4.badge}`);
console.log(`  Message: ${result4.message}`);
console.log(
  `  Has Warning: ${result4.hasWarning} ${result4.hasWarning ? "✅" : "❌ (Expected: true)"}`,
);
console.log(`  Safety Level: ${result4.safetyLevel}`);
if (result4.warningDetails) {
  console.log(`  Warning Type: ${result4.warningDetails.type}`);
  console.log(`  Recommendation: ${result4.warningDetails.recommendation}`);
}
console.log();

// Test Case 5: Product Safety Evaluation
console.log("📦 Test Case 5: Product Safety Evaluation");
console.log("-".repeat(80));

const productIngredients = [
  { name: "ビタミンC", amount: 100 }, // Optimal
  { name: "ビタミンD", amount: 0.025 }, // High but safe
  { name: "ビタミンE", amount: 800 }, // UL exceeded!
  { name: "カルシウム", amount: 400 }, // Adequate
];

const safetyEval = evaluateProductSafety(productIngredients);
console.log(
  `  Overall Safety Score: ${safetyEval.overallScore.toFixed(1)}/100`,
);
console.log(`  Grade: ${safetyEval.grade}`);
console.log(
  `  Has High Severity Warnings: ${safetyEval.hasHighSeverityWarnings}`,
);
console.log(`  Recommendation: ${safetyEval.recommendation}`);
console.log();

if (safetyEval.warnings.length > 0) {
  console.log(`  Warnings (${safetyEval.warnings.length}):`);
  for (const warning of safetyEval.warnings) {
    console.log(`    - [${warning.severity.toUpperCase()}] ${warning.name}:`);
    console.log(`      ${warning.message}`);
  }
} else {
  console.log(`  No warnings ✅`);
}
console.log();

// Test Case 6: Safety Score Calculation
console.log("📦 Test Case 6: Safety Score Calculation");
console.log("-".repeat(80));

const testProducts = [
  {
    name: "Perfect Product (All Optimal)",
    ingredients: [
      { name: "ビタミンC", amount: 100 },
      { name: "ビタミンD", amount: 0.0085 },
      { name: "ビタミンE", amount: 6 },
    ],
  },
  {
    name: "Risky Product (UL Exceeded)",
    ingredients: [
      { name: "ビタミンE", amount: 800 },
      { name: "ビタミンA", amount: 3.0 },
      { name: "鉄", amount: 60 },
    ],
  },
  {
    name: "Deficient Product",
    ingredients: [
      { name: "ビタミンC", amount: 30 },
      { name: "ビタミンD", amount: 0.002 },
      { name: "カルシウム", amount: 200 },
    ],
  },
];

for (const product of testProducts) {
  const score = calculateSafetyScore(product.ingredients);
  const warnings = extractWarningIngredients(product.ingredients);

  console.log(`  ${product.name}:`);
  console.log(`    Safety Score: ${score.toFixed(1)}/100`);
  console.log(`    Warnings: ${warnings.length}`);

  if (warnings.length > 0) {
    for (const w of warnings) {
      console.log(`      - [${w.severity}] ${w.name}: ${w.warningType}`);
    }
  }
  console.log();
}

console.log("=".repeat(80));
console.log("✅ All tests completed!");
console.log("=".repeat(80));
