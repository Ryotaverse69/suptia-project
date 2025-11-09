#!/usr/bin/env node

/**
 * 推測成分を既存のSanity成分にマッピングして登録
 *
 * 存在しない成分IDは既存の適切な成分にマッピングするか、
 * 登録をスキップします。
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

// 推測IDを実際のSanity IDにマッピング
const ingredientMapping = {
  "ingredient-bilberry": "ingredient-bilberry", // ✅ 新規登録完了
  "ingredient-diet-support": null, // 未登録（汎用的すぎて登録不可）
  "ingredient-sesamin": "ingredient-sesamin", // ✅ 新規登録完了
  "ingredient-enzyme": null, // 未登録（汎用的すぎて登録不可）
  "ingredient-multivitamin": null, // 未登録（汎用的すぎて登録不可）
  "ingredient-lactobacillus": "ingredient-probiotics", // プロバイオティクスにマッピング
  "ingredient-maca": "ingredient-maca", // ✅ 新規登録完了
  "ingredient-isoflavone": "ingredient-soy-isoflavones", // 大豆イソフラボンにマッピング
  "ingredient-squalene": "ingredient-squalene", // ✅ 新規登録完了
  "ingredient-manuka-honey": "ingredient-manuka-honey", // ✅ 新規登録完了
  "ingredient-propolis": "ingredient-propolis", // ✅ 新規登録完了
  "ingredient-multimineral": null, // 未登録（汎用的すぎて登録不可）
  "ingredient-chondroitin": null, // 未登録（要作成）
  "ingredient-placenta": null, // 未登録（要作成）
  "ingredient-ginkgo": "ingredient-ginkgo-biloba", // ギンコビロバにマッピング
};

// _keyを生成
function generateKey() {
  return `ingredient-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

async function applySuggestedIngredients() {
  console.log(`🧬 推測成分を登録（マッピング修正版）${isDryRun ? '（プレビュー）' : ''}...\n`);

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
    unmappedIngredients: new Set(),
  };

  for (const product of productsWithSuggestions) {
    try {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(`📦 ${product.name.substring(0, 60)}...`);
      console.log(`   slug: ${product.slug}\n`);

      // 推測成分をマッピング＆フィルタ
      const ingredients = [];
      let hasValidIngredient = false;

      for (const suggestedIng of product.suggestedIngredients) {
        const originalId = suggestedIng.ingredient;
        const mappedId = ingredientMapping[originalId] || originalId;

        if (ingredientMapping[originalId] === null) {
          console.log(`   ⚠️ スキップ: ${suggestedIng.name} (未登録)`);
          results.unmappedIngredients.add(originalId);
          continue;
        }

        if (mappedId !== originalId) {
          console.log(`   🔄 マッピング: ${originalId} → ${mappedId}`);
        } else {
          console.log(`   ✅ 追加: ${suggestedIng.name} (${mappedId})`);
        }

        ingredients.push({
          _key: generateKey(),
          amountMgPerServing: 0, // 初期値（後で手動入力が必要）
          ingredient: {
            _ref: mappedId,
            _type: "reference",
          },
        });
        hasValidIngredient = true;
      }

      if (!hasValidIngredient) {
        console.log(`   ⏭️ 全成分が未登録のためスキップ\n`);
        results.skipped.push({
          slug: product.slug,
          reason: "全成分が未登録",
        });
        continue;
      }

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

  if (results.unmappedIngredients.size > 0) {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`⚠️ 未登録の成分 (${results.unmappedIngredients.size}種類)`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    console.log("以下の成分記事を作成する必要があります:\n");
    Array.from(results.unmappedIngredients).forEach((id, i) => {
      console.log(`  ${i + 1}. ${id}`);
    });
    console.log();
  }

  if (results.success.length > 0) {
    console.log("✅ 登録した商品:\n");
    results.success.forEach((item, i) => {
      console.log(`  ${i + 1}. ${item.name?.substring(0, 50) || item.slug}...`);
      console.log(`     成分数: ${item.ingredientCount}件`);
    });
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
    console.log("  node scripts/apply-suggested-ingredients-fixed.mjs --fix\n");
  } else {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ 完了");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("次のステップ:");
    console.log("1. 全商品チェックスクリプトを再実行");
    console.log("  node scripts/check-all-products-ingredients.mjs\n");
    console.log("2. 未登録の成分記事を作成してSanityにインポート\n");
    console.log("3. 楽天ページから実際の配合量を入力\n");
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
