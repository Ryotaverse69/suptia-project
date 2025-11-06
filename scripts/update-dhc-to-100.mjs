#!/usr/bin/env node
/**
 * DHCビタミンD商品の安全性を100点・Sランクに更新するスクリプト
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

async function updateToS() {
  console.log("🔍 DHCビタミンD商品を検索中...");

  const product = await client.fetch(
    `*[_type == "product" && slug.current == "dhc-d-60-60"][0]{ _id, name, scores, tierRatings }`
  );

  if (!product) {
    console.error("❌ 商品が見つかりません");
    process.exit(1);
  }

  console.log(`📦 商品: ${product.name}`);
  console.log(`現在のscores:`, product.scores);
  console.log(`現在のtierRatings:`, product.tierRatings);

  const updatedProduct = await client
    .patch(product._id)
    .set({
      "scores.safety": 100,
      "tierRatings.safetyRank": "S"
    })
    .commit();

  console.log(`\n✅ 更新完了！`);
  console.log(`  安全性スコア: 77 → 100`);
  console.log(`  安全性ランク: B → S`);
  console.log(`\n更新後のscores:`, updatedProduct.scores);
  console.log(`更新後のtierRatings:`, updatedProduct.tierRatings);
}

updateToS().catch((error) => {
  console.error("❌ エラー:", error);
  process.exit(1);
});
