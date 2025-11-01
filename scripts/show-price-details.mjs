#!/usr/bin/env node

/**
 * 商品の価格データの詳細を表示
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 環境変数読み込み
const envPath = join(__dirname, "../apps/web/.env.local");
const envContent = readFileSync(envPath, "utf-8");
const envVars = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, "");
  }
});

const client = createClient({
  projectId: envVars.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: envVars.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: envVars.SANITY_API_TOKEN,
  useCdn: false,
});

async function showPriceDetails() {
  console.log("🔍 商品の価格データ詳細を表示...\n");

  // 全商品を取得（最初の10件）
  const query = `*[_type == "product" && availability == "in-stock" && defined(priceData)][0...10]{
    _id,
    name,
    source,
    priceData
  }`;

  const products = await client.fetch(query);

  console.log(`📦 表示商品数: ${products.length}\n`);

  for (const product of products) {
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`商品: ${product.name}`);
    console.log(`商品ID: ${product._id}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    if (!product.priceData || product.priceData.length === 0) {
      console.log("  価格データなし");
      continue;
    }

    product.priceData.forEach((price, index) => {
      console.log(`\n  [価格 ${index + 1}]`);
      console.log(`    source: ${price.source}`);
      console.log(`    amount: ¥${price.amount.toLocaleString()}`);
      console.log(`    storeName: ${price.storeName || "(未設定)"}`);
      console.log(`    shopName: ${price.shopName || "(未設定)"}`);
      console.log(`    productName: ${price.productName || "(未設定)"}`);
      console.log(`    itemCode: ${price.itemCode || "(未設定)"}`);
      console.log(`    url: ${price.url?.substring(0, 60)}...`);
    });
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}

showPriceDetails().catch((error) => {
  console.error("❌ エラー:", error);
  process.exit(1);
});
