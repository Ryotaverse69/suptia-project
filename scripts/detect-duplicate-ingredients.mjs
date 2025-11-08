#!/usr/bin/env node

/**
 * 商品内で重複している成分を検出するスクリプト
 *
 * 重複パターン:
 * 1. 同じ成分参照が複数回登録されている
 * 2. 同じ成分だが配合量が異なる（データ入力ミス）
 * 3. 同じ成分だが配合量が同じ（完全重複）
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

async function detectDuplicateIngredients() {
  console.log("🔍 重複成分を検出中...\n");

  const products = await client.fetch(
    `*[_type == "product" && defined(ingredients) && count(ingredients) > 0]{
      _id,
      name,
      slug,
      ingredients[]{
        _key,
        amountMgPerServing,
        ingredient->{
          _id,
          name
        }
      }
    }`
  );

  console.log(`📊 全商品数: ${products.length}件\n`);

  const results = {
    duplicates: [],
    clean: 0,
  };

  for (const product of products) {
    // 成分参照が解決されているものだけを処理
    const validIngredients = product.ingredients.filter(
      (ing) => ing.ingredient && ing.ingredient._id
    );

    if (validIngredients.length === 0) continue;

    // 成分IDでグループ化
    const ingredientMap = new Map();

    validIngredients.forEach((ing) => {
      const ingredientId = ing.ingredient._id;
      if (!ingredientMap.has(ingredientId)) {
        ingredientMap.set(ingredientId, []);
      }
      ingredientMap.get(ingredientId).push(ing);
    });

    // 重複を検出（同じ成分が2回以上登録されている）
    const duplicateEntries = Array.from(ingredientMap.entries()).filter(
      ([_, occurrences]) => occurrences.length > 1
    );

    if (duplicateEntries.length > 0) {
      const duplicateInfo = duplicateEntries.map(([ingredientId, occurrences]) => ({
        ingredientId,
        ingredientName: occurrences[0].ingredient.name,
        count: occurrences.length,
        amounts: occurrences.map((occ) => ({
          _key: occ._key,
          amount: occ.amountMgPerServing,
        })),
      }));

      results.duplicates.push({
        productId: product._id,
        productName: product.name,
        slug: product.slug.current,
        duplicateIngredients: duplicateInfo,
      });
    } else {
      results.clean++;
    }
  }

  // レポート出力
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📊 重複成分検出結果");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  console.log(`✅ 重複なし: ${results.clean}件`);
  console.log(`⚠️  重複あり: ${results.duplicates.length}件\n`);

  if (results.duplicates.length > 0) {
    console.log("⚠️  重複が検出された商品:\n");

    results.duplicates.forEach((item, idx) => {
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`[${idx + 1}] ${item.productName.substring(0, 60)}...`);
      console.log(`    slug: ${item.slug}\n`);

      item.duplicateIngredients.forEach((dup) => {
        console.log(`    🔄 成分: ${dup.ingredientName} (${dup.count}回登録)`);
        console.log(`       成分ID: ${dup.ingredientId}`);

        // 配合量が異なるか確認
        const uniqueAmounts = [...new Set(dup.amounts.map((a) => a.amount))];
        if (uniqueAmounts.length > 1) {
          console.log(`       ⚠️  配合量が異なります:`);
          dup.amounts.forEach((amt, i) => {
            console.log(`          ${i + 1}. ${amt.amount}mg (_key: ${amt._key})`);
          });
        } else {
          console.log(`       ℹ️  配合量は全て同じ: ${uniqueAmounts[0]}mg`);
          dup.amounts.forEach((amt, i) => {
            console.log(`          ${i + 1}. _key: ${amt._key}`);
          });
        }
        console.log();
      });
    });

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("💡 次のステップ");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("重複を削除するには、次のスクリプトを実行してください:");
    console.log("  node scripts/clean-duplicate-ingredients.mjs --fix\n");
  } else {
    console.log("✅ 全商品に重複はありません\n");
  }

  // 詳細データをJSONで出力（クリーンアップスクリプト用）
  if (results.duplicates.length > 0) {
    const fs = await import("fs");
    fs.writeFileSync(
      join(__dirname, "duplicate-ingredients-report.json"),
      JSON.stringify(results.duplicates, null, 2)
    );
    console.log("📄 詳細レポートを保存しました: scripts/duplicate-ingredients-report.json\n");
  }
}

detectDuplicateIngredients()
  .then(() => {
    console.log("✅ スクリプト完了\n");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ エラーが発生しました:", error);
    process.exit(1);
  });
