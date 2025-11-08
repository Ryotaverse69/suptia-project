#!/usr/bin/env node

/**
 * 商品内で重複している成分を削除するスクリプト
 *
 * 重複削除ロジック:
 * 1. 配合量が全て同じ場合 → 最初の1つを残して削除
 * 2. 配合量が異なる場合 → 最大値を残して削除（ユーザーに確認を促す）
 */

import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync } from "fs";

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

async function cleanDuplicateIngredients() {
  console.log(`🧹 重複成分のクリーンアップ${isDryRun ? '（プレビューモード）' : ''}...\n`);

  // レポートファイルを読み込み
  let duplicatesData;
  try {
    const reportPath = join(__dirname, "duplicate-ingredients-report.json");
    duplicatesData = JSON.parse(readFileSync(reportPath, "utf-8"));
  } catch (error) {
    console.error("❌ エラー: duplicate-ingredients-report.jsonが見つかりません");
    console.error("   まず detect-duplicate-ingredients.mjs を実行してください\n");
    process.exit(1);
  }

  if (duplicatesData.length === 0) {
    console.log("✅ 重複する成分はありません\n");
    process.exit(0);
  }

  const results = {
    cleaned: [],
    skipped: [],
    failed: [],
  };

  for (const item of duplicatesData) {
    try {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(`📦 商品: ${item.productName.substring(0, 60)}...`);
      console.log(`   slug: ${item.slug}\n`);

      // 商品の生データを取得（参照解決なし）
      const product = await client.fetch(
        `*[_type == "product" && slug.current == $slug][0]{
          _id,
          name,
          ingredients
        }`,
        { slug: item.slug }
      );

      if (!product) {
        console.log(`   ⚠️  商品が見つかりません\n`);
        results.skipped.push({ slug: item.slug, reason: "商品が見つかりません" });
        continue;
      }

      let updatedIngredients = [...product.ingredients];
      let hasChanges = false;

      for (const dup of item.duplicateIngredients) {
        console.log(`   🔄 成分: ${dup.ingredientName} (${dup.count}回重複)`);

        // この成分の全エントリを取得
        const duplicateKeys = dup.amounts.map((amt) => amt._key);
        const duplicateAmounts = dup.amounts.map((amt) => amt.amount);

        // 配合量が全て同じかチェック
        const uniqueAmounts = [...new Set(duplicateAmounts)];

        let keepKey;
        if (uniqueAmounts.length === 1) {
          // 配合量が全て同じ → 最初の1つを残す
          keepKey = duplicateKeys[0];
          console.log(`      ℹ️  配合量が全て同じ (${uniqueAmounts[0]}mg)`);
          console.log(`      → 最初の1つを残して削除: _key=${keepKey}`);
        } else {
          // 配合量が異なる → 最大値を残す
          const maxAmount = Math.max(...duplicateAmounts);
          const maxIndex = duplicateAmounts.indexOf(maxAmount);
          keepKey = duplicateKeys[maxIndex];
          console.log(`      ⚠️  配合量が異なります: ${duplicateAmounts.join(", ")}mg`);
          console.log(`      → 最大値を残して削除: ${maxAmount}mg (_key=${keepKey})`);
        }

        // 削除対象の_keyリスト
        const keysToRemove = duplicateKeys.filter((key) => key !== keepKey);
        console.log(`      削除予定: ${keysToRemove.length}件\n`);

        // 重複を削除（keepKey以外を除外）
        updatedIngredients = updatedIngredients.filter((ing) => {
          if (keysToRemove.includes(ing._key)) {
            return false; // 削除
          }
          return true; // 保持
        });

        hasChanges = true;
      }

      if (!hasChanges) {
        console.log(`   ℹ️  変更不要\n`);
        results.skipped.push({ slug: item.slug, reason: "変更不要" });
        continue;
      }

      if (isDryRun) {
        console.log(`   ✅ クリーンアップ予定\n`);
      } else {
        await client.patch(product._id).set({ ingredients: updatedIngredients }).commit();
        console.log(`   💾 Sanityに保存しました\n`);
      }

      results.cleaned.push({
        slug: item.slug,
        name: product.name,
        duplicates: item.duplicateIngredients,
      });
    } catch (error) {
      console.error(`   ❌ エラー: ${error.message}\n`);
      results.failed.push({ slug: item.slug, error: error.message });
    }
  }

  // サマリーレポート
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📊 クリーンアップ結果サマリー");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  console.log(`✅ クリーンアップ成功: ${results.cleaned.length}件`);
  console.log(`⚠️  スキップ: ${results.skipped.length}件`);
  console.log(`❌ 失敗: ${results.failed.length}件\n`);

  if (results.cleaned.length > 0) {
    console.log("✅ クリーンアップした商品:\n");
    results.cleaned.forEach((item, i) => {
      console.log(`  ${i + 1}. ${item.name?.substring(0, 50) || item.slug}...`);
      item.duplicates.forEach((dup) => {
        console.log(`     - ${dup.ingredientName}: ${dup.count}回 → 1回`);
      });
    });
    console.log();
  }

  if (isDryRun) {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("💡 次のステップ");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("実際にクリーンアップを実行するには、--fix オプションを付けて実行してください:");
    console.log("  node scripts/clean-duplicate-ingredients.mjs --fix\n");
  } else {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ 完了");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("次のステップ:");
    console.log("1. 全商品チェックスクリプトを再実行して結果を確認");
    console.log("  node scripts/check-all-products-ingredients.mjs\n");
  }
}

cleanDuplicateIngredients()
  .then(() => {
    console.log("✅ スクリプト完了\n");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ エラーが発生しました:", error);
    process.exit(1);
  });
