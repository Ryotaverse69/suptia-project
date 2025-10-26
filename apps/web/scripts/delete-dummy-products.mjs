#!/usr/bin/env node

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env.localを手動で読み込む
const envPath = resolve(__dirname, "../.env.local");
try {
  const envFile = readFileSync(envPath, "utf8");
  envFile.split("\n").forEach((line) => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, "");
      process.env[key] = value;
    }
  });
} catch (error) {
  console.warn("⚠️ .env.localファイルが見つかりません。");
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.SANITY_API_VERSION || "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function main() {
  console.log("🗑️ ダミー商品を削除中...\n");

  // sourceフィールドがない、またはrakuten/yahoo以外の商品を削除対象とする
  const dummyProducts = await client.fetch(
    `*[_type == "product" && (!defined(source) || (source != "rakuten" && source != "yahoo"))]{
      _id,
      name,
      source
    }`
  );

  console.log(`削除対象: ${dummyProducts.length}件\n`);

  if (dummyProducts.length === 0) {
    console.log("✅ ダミー商品は見つかりませんでした。");
    return;
  }

  console.log("削除を開始します...\n");

  let deleted = 0;
  let failed = 0;

  for (const product of dummyProducts) {
    try {
      await client.delete(product._id);
      deleted++;

      if (deleted % 10 === 0) {
        console.log(`進捗: ${deleted}/${dummyProducts.length}件削除済み...`);
      }
    } catch (error) {
      console.error(`❌ 削除失敗: ${product.name} (${product._id})`);
      console.error(`   エラー: ${error.message}`);
      failed++;
    }
  }

  console.log("\n" + "=".repeat(80));
  console.log("✅ 削除完了");
  console.log("=".repeat(80));
  console.log(`成功: ${deleted}件`);
  console.log(`失敗: ${failed}件`);
  console.log(`合計: ${dummyProducts.length}件\n`);

  // 削除後の統計
  const remainingProducts = await client.fetch(
    `count(*[_type == "product"])`
  );
  const rakutenCount = await client.fetch(
    `count(*[_type == "product" && source == "rakuten"])`
  );
  const yahooCount = await client.fetch(
    `count(*[_type == "product" && source == "yahoo"])`
  );

  console.log("📊 削除後の商品数:");
  console.log(`楽天: ${rakutenCount}件`);
  console.log(`Yahoo: ${yahooCount}件`);
  console.log(`合計: ${remainingProducts}件`);
}

main();
