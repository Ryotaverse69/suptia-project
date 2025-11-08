#!/usr/bin/env node

/**
 * 壊れた成分参照を復元し、配合量も修正するスクリプト
 *
 * 問題:
 * - ingredient フィールドがネストオブジェクト {_id, name} になっている
 * - 正しい形式は {_type: "reference", _ref: "..."}
 *
 * 修正内容:
 * 1. 全商品の成分参照を正しいreference形式に変換
 * 2. 疑わしい配合量を同時に修正
 */

import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, "../apps/web/.env.local") });

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "fny3jdcg";
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const SANITY_API_TOKEN = process.env.SANITY_API_TOKEN;

if (!SANITY_API_TOKEN) {
  console.error("❌ エラー: SANITY_API_TOKEN環境変数が設定されていません");
  process.exit(1);
}

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  token: SANITY_API_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

const shouldFix = process.argv.includes("--fix");
const isDryRun = !shouldFix;

// 配合量の修正マップ（成分ID → 正しい配合量）
const amountFixes = {
  "fancl-d-c-b-a-e-q10": [
    { ingredientId: "ingredient-vitamin-d", amount: 0.025 }
  ],
  "test-product-with-ingredients": [
    { ingredientId: "ingredient-vitamin-d", amount: 0.025 }
  ],
  "170-2800iu-d3-crown-1-1-60-d-k-vitamin-d3": [
    { ingredientId: "ingredient-vitamin-d", amount: 0.07 } // 最大配合量のものを修正
  ],
  "50-off-3-d-c-b-a-e-90": [
    { ingredientId: "ingredient-vitamin-b-complex", amount: 1.2 },
    { ingredientId: "ingredient-folic-acid", amount: 0.4 }
  ],
  "vitas-vitapower-120-c-gmp": [
    { ingredientId: "ingredient-folic-acid", amount: 0.4 }
  ]
};

async function restoreReferencesAndFixAmounts() {
  console.log(`🔧 成分参照の復元と配合量修正${isDryRun ? '（プレビューモード）' : ''}...\n`);

  const results = {
    restored: [],
    skipped: [],
    failed: [],
  };

  const slugs = Object.keys(amountFixes);

  for (const slug of slugs) {
    try {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(`📦 商品: ${slug}\n`);

      // 生データを取得
      const product = await client.fetch(
        `*[_type == "product" && slug.current == $slug][0]{
          _id,
          name,
          ingredients
        }`,
        { slug }
      );

      if (!product) {
        console.log(`   ⚠️  商品が見つかりません\n`);
        results.skipped.push({ slug, reason: "商品が見つかりません" });
        continue;
      }

      console.log(`   商品名: ${product.name.substring(0, 60)}...`);

      if (!product.ingredients || product.ingredients.length === 0) {
        console.log(`   ⚠️  成分データがありません\n`);
        results.skipped.push({ slug, reason: "成分データなし" });
        continue;
      }

      let hasChanges = false;
      const updatedIngredients = product.ingredients.map((ing) => {
        // 既に正しい参照形式の場合はスキップ
        if (ing.ingredient && ing.ingredient._type === "reference" && ing.ingredient._ref) {
          console.log(`   ✓ ${ing.ingredient._ref}: 既に正しい参照形式`);
          return ing;
        }

        // ネストオブジェクト形式の場合は参照形式に変換
        if (ing.ingredient && ing.ingredient._id) {
          const ingredientId = ing.ingredient._id;
          const ingredientName = ing.ingredient.name || "不明";

          console.log(`   🔄 ${ingredientName}: 参照形式に変換 (${ingredientId})`);
          hasChanges = true;

          // 配合量の修正が必要かチェック
          const fix = amountFixes[slug]?.find(f => f.ingredientId === ingredientId);
          let newAmount = ing.amountMgPerServing;

          if (fix && Math.abs(ing.amountMgPerServing - fix.amount) > 0.001) {
            console.log(`      配合量修正: ${ing.amountMgPerServing}mg → ${fix.amount}mg`);
            newAmount = fix.amount;
          }

          return {
            _key: ing._key,
            amountMgPerServing: newAmount,
            ingredient: {
              _type: "reference",
              _ref: ingredientId
            }
          };
        }

        // その他の形式（未登録など）
        console.log(`   ⚠️  未知の形式: ${JSON.stringify(ing).substring(0, 100)}...`);
        return ing;
      });

      if (!hasChanges) {
        console.log(`   ℹ️  変更不要\n`);
        results.skipped.push({ slug, reason: "変更不要" });
        continue;
      }

      if (isDryRun) {
        console.log(`\n   ✅ 修正予定\n`);
      } else {
        await client.patch(product._id).set({ ingredients: updatedIngredients }).commit();
        console.log(`\n   💾 Sanityに保存しました\n`);
      }

      results.restored.push({
        slug,
        name: product.name,
        count: updatedIngredients.length
      });

    } catch (error) {
      console.error(`   ❌ エラー: ${error.message}\n`);
      results.failed.push({ slug, error: error.message });
    }
  }

  // サマリーレポート
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📊 修正結果サマリー");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  console.log(`✅ 復元成功: ${results.restored.length}件`);
  console.log(`⚠️  スキップ: ${results.skipped.length}件`);
  console.log(`❌ 失敗: ${results.failed.length}件\n`);

  if (results.restored.length > 0) {
    console.log("✅ 復元に成功した商品:");
    results.restored.forEach((item, i) => {
      console.log(`  ${i + 1}. ${item.name?.substring(0, 50) || item.slug}...`);
      console.log(`     成分数: ${item.count}件`);
    });
    console.log();
  }

  if (isDryRun) {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("💡 次のステップ");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("実際に修正を適用するには、--fix オプションを付けて実行してください:");
    console.log("  node scripts/restore-references-and-fix-amounts.mjs --fix\n");
  } else {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ 完了");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("次のステップ:");
    console.log("1. 修正された商品を確認");
    console.log("  node scripts/check-suspicious-five.mjs\n");
    console.log("2. 全商品チェックを再実行");
    console.log("  node scripts/check-all-products-ingredients.mjs\n");
  }
}

restoreReferencesAndFixAmounts()
  .then(() => {
    console.log("✅ スクリプト完了\n");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ エラーが発生しました:", error);
    process.exit(1);
  });
