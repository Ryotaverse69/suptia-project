#!/usr/bin/env node

/**
 * 成分ガイドデータ復元スクリプト
 *
 * コンプライアンス修正で誤って変更された成分ガイドの記事を
 * Sanityの履歴から復元します。
 *
 * 使用方法:
 *   node scripts/restore-ingredient-data.mjs          # 復元対象を確認
 *   node scripts/restore-ingredient-data.mjs --restore # 実際に復元
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env.localをパース
const envPath = join(__dirname, "../apps/web/.env.local");
const envFile = readFileSync(envPath, "utf-8");
const env = {};
envFile.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim();
  }
});

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-07-01",
  useCdn: false,
  token: env.SANITY_API_TOKEN,
});

// 置換された可能性のあるテキストパターン（修正後のテキスト）
const REPLACEMENT_PATTERNS = [
  "健康維持をサポート",
  "健やかな毎日をサポート",
  "糖質バランスをサポート",
  "健康的な生活習慣をサポート",
  "めぐりをサポート",
  "血管の健康をサポート",
  "心の健康をサポート",
  "考える力をサポート",
  "脳の健康をサポート",
  "肌の調子を整える",
  "季節の変化に対応",
  "体調管理をサポート",
  "快適な毎日をサポート",
  "リラックスをサポート",
  "清潔感",
  "すっきり感",
  "清潔な状態",
  "衛生的",
  "健康管理をサポート",
  "清潔を保つ",
  "運動時のエネルギー消費をサポート",
  "運動効率をサポート",
  "スリムな毎日をサポート",
  "活動的な毎日をサポート",
  "いきいきとした毎日に",
  "健やかなリズムをサポート",
  "女性の健康をサポート",
  "体内バランスをサポート",
  "すっきりとした毎日に",
  "年齢に応じた美容",
  "いつまでも元気に",
  "エイジングケア",
  "年齢に応じた健康をサポート",
  "いつまでも若々しく",
  "ハリのある毎日を",
  "透明感のある肌に",
  "引き締まった印象に",
];

async function main() {
  const args = process.argv.slice(2);
  const doRestore = args.includes("--restore");

  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║     成分ガイドデータ復元スクリプト                         ║");
  console.log("╚════════════════════════════════════════════════════════════╝\n");

  if (doRestore) {
    console.log("⚠️  復元モード: Sanityの履歴からデータを復元します\n");
  } else {
    console.log("🔍 確認モード: 復元対象の成分を表示します\n");
  }

  try {
    console.log("🔍 Sanityから成分データを取得中...");
    const ingredients = await client.fetch(`
      *[_type == "ingredient"] {
        _id,
        _rev,
        name,
        description,
        benefits,
        recommendedDosage,
        sideEffects,
        interactions
      }
    `);
    console.log(`   → ${ingredients.length}件の成分を取得\n`);

    // 置換された可能性のある成分を検出
    const affectedIngredients = [];

    for (const ingredient of ingredients) {
      const textFields = [
        ingredient.description || "",
        ingredient.recommendedDosage || "",
        ingredient.sideEffects || "",
        ...(ingredient.benefits || []),
        ...(ingredient.interactions || []),
      ].join(" ");

      const foundPatterns = REPLACEMENT_PATTERNS.filter((pattern) =>
        textFields.includes(pattern)
      );

      if (foundPatterns.length > 0) {
        affectedIngredients.push({
          ...ingredient,
          foundPatterns,
        });
      }
    }

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`📋 復元が必要な可能性のある成分: ${affectedIngredients.length}件\n`);

    if (affectedIngredients.length === 0) {
      console.log("✅ 復元が必要な成分は見つかりませんでした。\n");
      console.log("   成分ガイドはすでに正常な状態です。");
      process.exit(0);
    }

    for (const ingredient of affectedIngredients) {
      console.log(`📄 ${ingredient.name}`);
      console.log(`   ID: ${ingredient._id}`);
      console.log(`   検出パターン: ${ingredient.foundPatterns.slice(0, 3).join(", ")}${ingredient.foundPatterns.length > 3 ? "..." : ""}`);
      console.log("");
    }

    if (doRestore) {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("🔄 履歴から復元を試みます...\n");

      let restoredCount = 0;
      let failedCount = 0;

      for (const ingredient of affectedIngredients) {
        try {
          // Sanityの履歴APIを使用して過去のバージョンを取得
          const historyUrl = `https://${env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-06-07/data/history/${env.NEXT_PUBLIC_SANITY_DATASET || "production"}/documents/${ingredient._id}?excludeContent=false`;

          const response = await fetch(historyUrl, {
            headers: {
              Authorization: `Bearer ${env.SANITY_API_TOKEN}`,
            },
          });

          if (response.ok) {
            const history = await response.json();
            const transactions = history.documents || [];

            // 最新から2番目のバージョン（修正前）を探す
            if (transactions.length >= 2) {
              const previousVersion = transactions[1]; // 1つ前のバージョン

              // 復元
              await client
                .patch(ingredient._id)
                .set({
                  description: previousVersion.description,
                  benefits: previousVersion.benefits,
                  recommendedDosage: previousVersion.recommendedDosage,
                  sideEffects: previousVersion.sideEffects,
                  interactions: previousVersion.interactions,
                })
                .commit();

              console.log(`✅ ${ingredient.name} を復元しました`);
              restoredCount++;
            } else {
              console.log(`⚠️  ${ingredient.name}: 履歴が不十分です（手動復元が必要）`);
              failedCount++;
            }
          } else {
            console.log(`❌ ${ingredient.name}: 履歴を取得できませんでした`);
            failedCount++;
          }
        } catch (error) {
          console.log(`❌ ${ingredient.name}: エラー - ${error.message}`);
          failedCount++;
        }
      }

      console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("📊 復元結果\n");
      console.log(`   ✅ 復元成功: ${restoredCount}件`);
      console.log(`   ❌ 要手動対応: ${failedCount}件\n`);

      if (failedCount > 0) {
        console.log("💡 手動対応が必要な成分は、Sanity Studio の履歴機能から");
        console.log("   個別に復元してください。\n");
      }
    } else {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("💡 次のステップ\n");
      console.log("   1. Sanity Studioで各成分の履歴を確認");
      console.log("      https://suptia.sanity.studio/");
      console.log("");
      console.log("   2. 自動復元を試みる場合:");
      console.log("      node scripts/restore-ingredient-data.mjs --restore");
      console.log("");
      console.log("   3. 手動で復元する場合:");
      console.log("      - Sanity Studioで成分を開く");
      console.log("      - 右上の「History」をクリック");
      console.log("      - 修正前のバージョンを選択して「Restore」\n");
    }

  } catch (error) {
    console.error("❌ エラーが発生しました:", error.message);
    process.exit(1);
  }
}

main();
