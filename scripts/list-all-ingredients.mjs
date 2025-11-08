#!/usr/bin/env node

/**
 * Sanityに登録されている全成分を一覧表示
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

async function listAllIngredients() {
  console.log("🔍 Sanityに登録されている全成分を取得中...\n");

  const ingredients = await client.fetch(
    `*[_type == "ingredient"] | order(name asc) {
      _id,
      name,
      nameEn,
      category,
      evidenceLevel
    }`
  );

  console.log(`📊 登録済み成分数: ${ingredients.length}件\n`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  ingredients.forEach((ing, i) => {
    console.log(`${i + 1}. ${ing.name} (${ing.nameEn || 'N/A'})`);
    console.log(`   ID: ${ing._id}`);
    console.log(`   カテゴリ: ${ing.category || 'なし'}`);
    console.log(`   エビデンスレベル: ${ing.evidenceLevel || 'なし'}`);
    console.log();
  });
}

listAllIngredients()
  .then(() => {
    console.log("✅ 完了\n");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ エラー:", error);
    process.exit(1);
  });
