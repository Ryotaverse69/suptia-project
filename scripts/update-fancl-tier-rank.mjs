#!/usr/bin/env node
/**
 * FANCLカルシウム商品のTierランクを更新するスクリプト
 */

import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, "../apps/web/.env.local") });

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET;
const SANITY_API_TOKEN = process.env.SANITY_API_TOKEN;

if (!SANITY_API_TOKEN) {
  console.error("❌ SANITY_API_TOKEN is not set");
  process.exit(1);
}

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  token: SANITY_API_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

// スコアからTierランクに変換
function scoreToTierRank(score) {
  if (score >= 90) return "S";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  return "D";
}

async function updateTierRank() {
  console.log("🔍 FANCLカルシウム商品を検索中...");

  // 商品を検索
  const product = await client.fetch(
    `*[_type == "product" && slug.current == "fancl-d-3"][0]{ _id, name, scores, tierRatings }`
  );

  if (!product) {
    console.error("❌ 商品が見つかりません");
    process.exit(1);
  }

  console.log(`📦 商品: ${product.name}`);
  console.log(`現在のscores:`, product.scores);
  console.log(`現在のtierRatings:`, product.tierRatings);

  // 安全性ランクを再計算
  const safetyScore = product.scores?.safety || 0;
  const newSafetyRank = scoreToTierRank(safetyScore);

  console.log(`\n📊 安全性スコア: ${safetyScore}`);
  console.log(`📊 計算された安全性ランク: ${newSafetyRank}`);

  // tierRatingsを更新
  const updatedProduct = await client
    .patch(product._id)
    .set({ "tierRatings.safetyRank": newSafetyRank })
    .commit();

  console.log(`\n✅ 安全性ランクを ${product.tierRatings?.safetyRank || "なし"} → ${newSafetyRank} に更新しました`);
  console.log(`更新後のtierRatings:`, updatedProduct.tierRatings);
}

updateTierRank().catch((error) => {
  console.error("❌ エラー:", error);
  process.exit(1);
});
