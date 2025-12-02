#!/usr/bin/env node

/**
 * 成分ガイドデータ復元スクリプト（バックアップファイルから）
 *
 * all-ingredients-content.json から成分ガイドのデータを復元します。
 *
 * 使用方法:
 *   node scripts/restore-ingredients-from-backup.mjs          # 確認のみ
 *   node scripts/restore-ingredients-from-backup.mjs --restore # 実際に復元
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

// バックアップファイルを読み込み
const backupPath = join(__dirname, "../all-ingredients-content.json");
const backupData = JSON.parse(readFileSync(backupPath, "utf-8"));

async function main() {
  const args = process.argv.slice(2);
  const doRestore = args.includes("--restore");

  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║   成分ガイドデータ復元（バックアップファイルから）         ║");
  console.log("╚════════════════════════════════════════════════════════════╝\n");

  if (doRestore) {
    console.log("⚠️  復元モード: バックアップからSanityに復元します\n");
  } else {
    console.log("🔍 確認モード: 復元対象を表示します\n");
  }

  console.log(`📂 バックアップファイル: all-ingredients-content.json`);
  console.log(`   → ${backupData.length}件の成分データ\n`);

  try {
    // 現在のSanityデータを取得
    console.log("🔍 Sanityから現在の成分データを取得中...");
    const currentIngredients = await client.fetch(`
      *[_type == "ingredient"] {
        _id,
        name,
        slug
      }
    `);
    console.log(`   → ${currentIngredients.length}件の成分を取得\n`);

    // バックアップデータとマッチング
    const toRestore = [];
    for (const backup of backupData) {
      const slugCurrent = backup.slug?.current || backup.slug?._type === "slug" ? backup.slug.current : null;
      if (!slugCurrent) continue;

      const match = currentIngredients.find((i) => {
        const currentSlug = i.slug?.current;
        return currentSlug === slugCurrent || i._id === slugCurrent || i._id === `ingredient-${slugCurrent}`;
      });

      if (match) {
        toRestore.push({
          sanityId: match._id,
          name: backup.name,
          backup,
        });
      }
    }

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`📋 復元対象: ${toRestore.length}件\n`);

    if (toRestore.length === 0) {
      console.log("⚠️  復元対象が見つかりませんでした。\n");
      process.exit(0);
    }

    // 最初の5件を表示
    console.log("📄 復元対象サンプル（最初の5件）:\n");
    for (const item of toRestore.slice(0, 5)) {
      console.log(`   ✓ ${item.name}`);
      console.log(`     ID: ${item.sanityId}`);
    }
    if (toRestore.length > 5) {
      console.log(`   ... 他 ${toRestore.length - 5}件\n`);
    }

    if (doRestore) {
      console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("🔄 復元を実行中...\n");

      let restoredCount = 0;
      let errorCount = 0;

      for (const item of toRestore) {
        try {
          // 復元対象フィールド
          const updateData = {
            description: item.backup.description,
            benefits: item.backup.benefits,
            recommendedDosage: item.backup.recommendedDosage,
            sideEffects: item.backup.sideEffects,
            interactions: item.backup.interactions,
            faqs: item.backup.faqs,
            foodSources: item.backup.foodSources,
            references: item.backup.references,
            scientificBackground: item.backup.scientificBackground,
          };

          // undefined値を除外
          Object.keys(updateData).forEach((key) => {
            if (updateData[key] === undefined) {
              delete updateData[key];
            }
          });

          await client.patch(item.sanityId).set(updateData).commit();
          console.log(`✅ ${item.name}`);
          restoredCount++;
        } catch (error) {
          console.log(`❌ ${item.name}: ${error.message}`);
          errorCount++;
        }
      }

      console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("📊 復元結果\n");
      console.log(`   ✅ 復元成功: ${restoredCount}件`);
      console.log(`   ❌ エラー: ${errorCount}件\n`);

      if (restoredCount > 0) {
        console.log("🎉 成分ガイドのデータが復元されました！\n");
      }
    } else {
      console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("💡 次のステップ\n");
      console.log("   復元を実行するには:");
      console.log("   node scripts/restore-ingredients-from-backup.mjs --restore\n");
    }

  } catch (error) {
    console.error("❌ エラーが発生しました:", error.message);
    process.exit(1);
  }
}

main();
