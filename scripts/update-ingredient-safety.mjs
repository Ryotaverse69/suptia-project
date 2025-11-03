/**
 * カルシウムと葉酸の安全性レベルをSに更新するスクリプト
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 環境変数読み込み
const envPath = join(__dirname, "../apps/web/.env.local");
const envContent = readFileSync(envPath, "utf8");

const SANITY_PROJECT_ID = envContent.match(/NEXT_PUBLIC_SANITY_PROJECT_ID=(.+)/)?.[1]?.trim();
const SANITY_DATASET = envContent.match(/NEXT_PUBLIC_SANITY_DATASET=(.+)/)?.[1]?.trim() || "production";
const SANITY_API_TOKEN = envContent.match(/SANITY_API_TOKEN=(.+)/)?.[1]?.trim();

if (!SANITY_PROJECT_ID || !SANITY_API_TOKEN) {
  console.error("❌ 環境変数が不足しています");
  console.error("  SANITY_PROJECT_ID:", SANITY_PROJECT_ID ? "✓" : "✗");
  console.error("  SANITY_API_TOKEN:", SANITY_API_TOKEN ? "✓" : "✗");
  process.exit(1);
}

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  token: SANITY_API_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

async function main() {
  console.log("📝 成分の安全性レベルを更新します...\n");

  const ingredientsToUpdate = [
    { id: "ingredient-calcium", name: "カルシウム" },
    { id: "ingredient-folic-acid", name: "葉酸" },
  ];

  for (const ing of ingredientsToUpdate) {
    try {
      await client
        .patch(ing.id)
        .set({ safetyLevel: "S" })
        .commit();

      console.log(`✅ ${ing.name} の安全性レベルをSに更新しました`);
    } catch (error) {
      console.error(`❌ ${ing.name} の更新に失敗: ${error.message}`);
    }
  }

  console.log("\n🎉 完了しました！");
}

main().catch((error) => {
  console.error("❌ エラーが発生しました:", error);
  process.exit(1);
});
