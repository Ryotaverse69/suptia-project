#!/usr/bin/env node
/**
 * Real Data Validation Script
 *
 * Purpose: Measure ingredient extraction coverage improvement after adding
 *          new aliases for Vitamin B complex and amino acids.
 *
 * Metrics:
 * - Overall coverage rate (products with ingredient amounts / total products)
 * - Category-specific coverage (Vitamin B, Amino Acids, etc.)
 * - Before/After comparison
 */

import { createClient } from "@sanity/client";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2023-05-03",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

console.log("=".repeat(80));
console.log("Real Data Validation - Coverage Analysis");
console.log("=".repeat(80));
console.log();

async function analyzeCoverage() {
  // Fetch all products
  const products = await client.fetch(`
    *[_type == "product"] {
      _id,
      name,
      allIngredients
    }
  `);

  console.log(`📦 商品総数: ${products.length}件`);
  console.log();

  // Overall coverage
  let totalIngredients = 0;
  let ingredientsWithAmount = 0;
  let productsWithIngredients = 0;
  let productsWithAmounts = 0;

  // Category-specific tracking
  const categoryStats = {
    "ビタミンB群": { total: 0, withAmount: 0 },
    "アミノ酸": { total: 0, withAmount: 0 },
    "その他": { total: 0, withAmount: 0 },
  };

  const vitaminBNames = [
    "ビタミンB1",
    "ビタミンB2",
    "ビタミンB6",
    "ビタミンB12",
    "ナイアシン",
    "パントテン酸",
    "ビオチン",
    "葉酸",
    "イノシトール",
    "コリン",
  ];

  const aminoAcidNames = [
    "ロイシン",
    "イソロイシン",
    "バリン",
    "リジン",
    "メチオニン",
    "システイン",
    "フェニルアラニン",
    "トリプトファン",
    "スレオニン",
    "ヒスチジン",
    "チロシン",
    "アルギニン",
    "グルタミン",
    "カルニチン",
    "タウリン",
    "グリシン",
    "プロリン",
    "アラニン",
    "セリン",
    "アスパラギン酸",
    "グルタミン酸",
  ];

  for (const product of products) {
    if (!product.allIngredients || product.allIngredients.length === 0) {
      continue;
    }

    productsWithIngredients++;
    let hasAtLeastOneAmount = false;

    for (const ing of product.allIngredients) {
      if (!ing.name) continue;

      totalIngredients++;
      const ingredientName = ing.name;

      // Check category
      let category = "その他";
      if (vitaminBNames.some(name => ingredientName.includes(name))) {
        category = "ビタミンB群";
      } else if (aminoAcidNames.some(name => ingredientName.includes(name))) {
        category = "アミノ酸";
      }

      categoryStats[category].total++;

      if (ing.amount && ing.amount > 0) {
        ingredientsWithAmount++;
        hasAtLeastOneAmount = true;
        categoryStats[category].withAmount++;
      }
    }

    if (hasAtLeastOneAmount) {
      productsWithAmounts++;
    }
  }

  // Display results
  console.log("📊 全体カバー率:");
  console.log("-".repeat(80));
  console.log(
    `  商品（成分情報あり）: ${productsWithIngredients}/${products.length}件 (${((productsWithIngredients / products.length) * 100).toFixed(1)}%)`
  );
  console.log(
    `  商品（成分量あり）: ${productsWithAmounts}/${products.length}件 (${((productsWithAmounts / products.length) * 100).toFixed(1)}%)`
  );
  console.log(
    `  成分（量データあり）: ${ingredientsWithAmount}/${totalIngredients}個 (${((ingredientsWithAmount / totalIngredients) * 100).toFixed(1)}%)`
  );
  console.log();

  console.log("📊 カテゴリー別カバー率:");
  console.log("-".repeat(80));
  for (const [category, stats] of Object.entries(categoryStats)) {
    if (stats.total === 0) continue;
    const coverage = ((stats.withAmount / stats.total) * 100).toFixed(1);
    console.log(
      `  ${category}: ${stats.withAmount}/${stats.total}個 (${coverage}%)`
    );
  }
  console.log();

  // Find products with Vitamin B or amino acids but missing amounts
  console.log("🔍 改善可能な商品（ビタミンB群・アミノ酸で量データなし）:");
  console.log("-".repeat(80));

  let improvableCount = 0;
  for (const product of products) {
    if (!product.allIngredients) continue;

    const missingIngredients = product.allIngredients
      .filter(ing => {
        if (!ing.name) return false;
        const name = ing.name;
        const isTargetCategory =
          vitaminBNames.some(vit => name.includes(vit)) ||
          aminoAcidNames.some(aa => name.includes(aa));
        return isTargetCategory && (!ing.amount || ing.amount === 0);
      })
      .map(ing => ing.name);

    if (missingIngredients.length > 0) {
      improvableCount++;
      if (improvableCount <= 10) {
        // Show first 10
        console.log(`  ${product.name}`);
        console.log(`    → 欠損: ${missingIngredients.join(", ")}`);
      }
    }
  }

  if (improvableCount > 10) {
    console.log(`  ... 他 ${improvableCount - 10}件`);
  }
  console.log();

  // Recommendations
  console.log("💡 推奨アクション:");
  console.log("-".repeat(80));

  const overallCoverage = (ingredientsWithAmount / totalIngredients) * 100;
  const vitaminBCoverage =
    categoryStats["ビタミンB群"].total > 0
      ? (categoryStats["ビタミンB群"].withAmount /
          categoryStats["ビタミンB群"].total) *
        100
      : 0;
  const aminoAcidCoverage =
    categoryStats["アミノ酸"].total > 0
      ? (categoryStats["アミノ酸"].withAmount /
          categoryStats["アミノ酸"].total) *
        100
      : 0;

  console.log(`  1. 全体カバー率: ${overallCoverage.toFixed(1)}%`);
  if (overallCoverage < 85) {
    console.log(
      `     ⚠️  目標85%に対して不足。さらなるエイリアス追加または手動補完が必要。`
    );
  } else {
    console.log(`     ✅ 目標85%を達成！`);
  }
  console.log();

  console.log(`  2. ビタミンB群カバー率: ${vitaminBCoverage.toFixed(1)}%`);
  if (vitaminBCoverage < 80) {
    console.log(
      `     ⚠️  改善の余地あり。商品説明文のパターンを再確認してください。`
    );
  } else {
    console.log(`     ✅ 良好！`);
  }
  console.log();

  console.log(`  3. アミノ酸カバー率: ${aminoAcidCoverage.toFixed(1)}%`);
  if (aminoAcidCoverage < 80) {
    console.log(
      `     ⚠️  改善の余地あり。商品説明文のパターンを再確認してください。`
    );
  } else {
    console.log(`     ✅ 良好！`);
  }
  console.log();

  console.log(`  4. 改善可能商品数: ${improvableCount}件`);
  if (improvableCount > 20) {
    console.log(
      `     💡 Priority Item 9: 手動補完UI の実装を検討してください。`
    );
  }
  console.log();

  console.log("=".repeat(80));

  return {
    overallCoverage,
    vitaminBCoverage,
    aminoAcidCoverage,
    improvableCount,
    totalProducts: products.length,
    productsWithAmounts,
  };
}

analyzeCoverage().catch(console.error);
