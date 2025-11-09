#!/usr/bin/env node

/**
 * 推測された成分を商品に登録
 *
 * missing-ingredients-report.jsonから推測成分を読み込み、
 * 商品データに追加します。
 *
 * 注意: amountMgPerServingは初期値0で登録されます。
 * 実際の配合量は楽天ページから手動で入力する必要があります。
 */

import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync } from "fs";

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

const shouldFix = process.argv.includes("--fix");
const isDryRun = !shouldFix;

// _keyを生成
function generateKey() {
  return `ingredient-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

async function applySuggestedIngredients() {
  console.log(`🧬 推測成分を登録${isDryRun ? '（プレビュー）' : ''}...\n`);

  // レポートファイルを読み込み
  let reportData;
  try {
    const reportPath = join(__dirname, "missing-ingredients-report.json");
    reportData = JSON.parse(readFileSync(reportPath, "utf-8"));
  } catch (error) {
    console.error("❌ エラー: missing-ingredients-report.jsonが見つかりません");
    console.error("   まず analyze-missing-ingredients.mjs を実行してください\n");
    process.exit(1);
  }

  // 推測成分がある商品のみ抽出
  const productsWithSuggestions = reportData.products.filter(
    (p) => p.suggestedIngredients && p.suggestedIngredients.length > 0
  );

  console.log(`📊 対象商品: ${productsWithSuggestions.length}件\n`);

  const results = {
    success: [],
    skipped: [],
    failed: [],
  };

  for (const product of productsWithSuggestions) {
    try {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(`📦 ${product.name.substring(0, 60)}...`);
      console.log(`   slug: ${product.slug}\n`);

      // 推測成分をingredients配列に変換
      const ingredients = product.suggestedIngredients.map((ing) => {
        const key = generateKey();
        console.log(`   💡 追加: ${ing.name} (${ing.ingredient})`);

        return {
          _key: key,
          amountMgPerServing: 0, // 初期値（後で手動入力が必要）
          ingredient: {
            _ref: ing.ingredient,
            _type: "reference",
          },
        };
      });

      if (isDryRun) {
        console.log(`   ✅ 登録予定: ${ingredients.length}件の成分\n`);
      } else {
        // Sanityに保存
        await client.patch(product._id).set({ ingredients }).commit();
        console.log(`   💾 Sanityに保存しました\n`);
      }

      results.success.push({
        slug: product.slug,
        name: product.name,
        ingredientCount: ingredients.length,
      });
    } catch (error) {
      console.error(`   ❌ エラー: ${error.message}\n`);
      results.failed.push({
        slug: product.slug,
        error: error.message,
      });
    }
  }

  // サマリー
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📊 登録結果サマリー");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  console.log(`✅ 登録成功: ${results.success.length}件`);
  console.log(`⏭️  スキップ: ${results.skipped.length}件`);
  console.log(`❌ 失敗: ${results.failed.length}件\n`);

  if (results.success.length > 0) {
    console.log("✅ 登録した商品:\n");
    results.success.slice(0, 10).forEach((item, i) => {
      console.log(`  ${i + 1}. ${item.name?.substring(0, 50) || item.slug}...`);
      console.log(`     成分数: ${item.ingredientCount}件`);
    });
    if (results.success.length > 10) {
      console.log(`  ...他${results.success.length - 10}件\n`);
    }
    console.log();
  }

  // 推測不可の商品リスト
  const productsWithoutSuggestions = reportData.products.filter(
    (p) => !p.suggestedIngredients || p.suggestedIngredients.length === 0
  );

  if (productsWithoutSuggestions.length > 0) {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`⚠️ 推測不可の商品 (${productsWithoutSuggestions.length}件)`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    console.log("以下の商品は手動で成分データを入力する必要があります:\n");
    productsWithoutSuggestions.forEach((item, i) => {
      console.log(`  ${i + 1}. ${item.name.substring(0, 60)}...`);
      console.log(`     slug: ${item.slug}`);
      if (item.rakutenUrl) {
        console.log(`     URL: ${item.rakutenUrl}`);
      }
      console.log();
    });
  }

  if (isDryRun) {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("💡 次のステップ");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("実際に登録を実行するには、--fix オプションを付けて実行してください:");
    console.log("  node scripts/apply-suggested-ingredients.mjs --fix\n");
    console.log("⚠️ 注意: amountMgPerServingは初期値0で登録されます");
    console.log("   実際の配合量は楽天ページから手動で入力する必要があります\n");
  } else {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ 完了");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("次のステップ:");
    console.log("1. 全商品チェックスクリプトを再実行");
    console.log("  node scripts/check-all-products-ingredients.mjs\n");
    console.log("2. 楽天ページから実際の配合量を入力");
    console.log("  （amountMgPerServingが0の商品に対して）\n");
    console.log(`3. 推測不可の${productsWithoutSuggestions.length}件の商品に手動で成分データを追加\n`);
  }
}

applySuggestedIngredients()
  .then(() => {
    console.log("✅ スクリプト完了\n");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ エラーが発生しました:", error);
    process.exit(1);
  });
