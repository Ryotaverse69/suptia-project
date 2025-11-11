#!/usr/bin/env node
import { createClient } from "@sanity/client";
import "dotenv/config";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// コマンドライン引数をチェック
const isDryRun = !process.argv.includes("--fix");

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("🔧 成分のsafetyLevel一括設定スクリプト");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

if (isDryRun) {
  console.log("🔍 ドライランモード（実際の更新は行いません）\n");
} else {
  console.log("⚠️  実行モード（実際に更新します）\n");
}

// 全成分データを取得
const ingredients = await client.fetch(`
  *[_type == "ingredient"]{
    _id,
    name,
    evidenceLevel,
    safetyLevel
  } | order(name asc)
`);

console.log(`📊 全成分数: ${ingredients.length}件\n`);

// safetyLevelが未設定または不正な値の成分を抽出
const validLevels = ["S", "A", "B", "C", "D"];
const needsUpdate = ingredients.filter(i => {
  if (!i.safetyLevel) return true; // null or undefined
  if (!validLevels.includes(i.safetyLevel)) return true; // invalid value
  return false;
});

console.log(`🔄 更新が必要な成分: ${needsUpdate.length}件\n`);

if (needsUpdate.length === 0) {
  console.log("✅ すべての成分のsafetyLevelは既に設定されています！\n");
  process.exit(0);
}

// 更新内容を表示
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("📋 更新内容（最初の10件）");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

for (const [index, ingredient] of needsUpdate.slice(0, 10).entries()) {
  const newSafetyLevel = ingredient.evidenceLevel || "B"; // evidenceLevelがない場合はBをデフォルト
  console.log(`${index + 1}. ${ingredient.name}`);
  console.log(`   evidenceLevel: ${ingredient.evidenceLevel || "(なし)"}`);
  console.log(`   現在のsafetyLevel: ${ingredient.safetyLevel || "(なし)"}`);
  console.log(`   新しいsafetyLevel: ${newSafetyLevel}`);
  console.log('');
}

if (needsUpdate.length > 10) {
  console.log(`... 他${needsUpdate.length - 10}件\n`);
}

// 実際に更新
if (!isDryRun) {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🔧 safetyLevelを更新中...");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  let successCount = 0;
  let errorCount = 0;

  for (const ingredient of needsUpdate) {
    try {
      const newSafetyLevel = ingredient.evidenceLevel || "B";

      await client
        .patch(ingredient._id)
        .set({ safetyLevel: newSafetyLevel })
        .commit();

      successCount++;
      console.log(`✅ ${ingredient.name.substring(0, 60)}... - safetyLevel: ${newSafetyLevel}`);
    } catch (error) {
      errorCount++;
      console.error(`❌ ${ingredient.name.substring(0, 60)}... - エラー: ${error.message}`);
    }
  }

  console.log(`\n更新完了: ${successCount}件成功、${errorCount}件失敗\n`);
} else {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("💡 次のステップ");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  console.log("実際に更新を適用するには、--fix オプションを付けて実行してください:");
  console.log("  node scripts/set-safety-levels.mjs --fix\n");
}

console.log("✅ 処理完了\n");
