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
  console.log("🔍 重複slugの詳細分析中...\n");

  // 全商品を取得
  const products = await client.fetch(
    `*[_type == "product" && (source == "rakuten" || source == "yahoo")]{
      _id,
      name,
      "slug": slug.current,
      source,
      janCode,
      priceJPY
    }`
  );

  // slugごとにグループ化
  const slugGroups = products.reduce((acc, product) => {
    if (!acc[product.slug]) {
      acc[product.slug] = [];
    }
    acc[product.slug].push(product);
    return acc;
  }, {});

  // 重複があるslugのみフィルター
  const duplicates = Object.entries(slugGroups).filter(([_, products]) => products.length > 1);

  console.log("=" .repeat(80));
  console.log(`⚠️ 重複slug: ${duplicates.length}件`);
  console.log("=".repeat(80) + "\n");

  let janMatches = 0;
  let sameSourceDuplicates = 0;
  let needsResolution = 0;

  duplicates.forEach(([slug, products], index) => {
    console.log(`[${index + 1}] Slug: ${slug} (${products.length}件)`);

    const janCodes = products.filter(p => p.janCode).map(p => p.janCode);
    const uniqueJanCodes = [...new Set(janCodes)];
    const sources = products.map(p => p.source);
    const uniqueSources = [...new Set(sources)];

    // JANコードが同じ = 価格比較用の正しい重複
    if (uniqueJanCodes.length === 1 && janCodes.length === products.length) {
      console.log(`   ✅ 価格比較用（JANコード一致: ${uniqueJanCodes[0]}）`);
      janMatches++;
    }
    // 同じソースで重複 = 削除すべき
    else if (uniqueSources.length < products.length) {
      console.log(`   ❌ 同じソース（${uniqueSources[0]}）で重複 - 削除推奨`);
      sameSourceDuplicates++;
      needsResolution++;
    }
    // 異なるソースだがJANコード不一致 = 要確認
    else {
      console.log(`   ⚠️ 異なるソースだがJANコード不一致 - 要確認`);
      needsResolution++;
    }

    products.forEach(p => {
      console.log(`      - ID: ${p._id}`);
      console.log(`        Source: ${p.source}`);
      console.log(`        JAN: ${p.janCode || "なし"}`);
      console.log(`        Price: ¥${p.priceJPY?.toLocaleString()}`);
      console.log(`        Name: ${p.name.substring(0, 60)}...`);
    });
    console.log("");
  });

  console.log("\n" + "=".repeat(80));
  console.log("📊 重複slug統計");
  console.log("=".repeat(80));
  console.log(`✅ 価格比較用（JANコード一致）: ${janMatches}件 - そのまま保持`);
  console.log(`❌ 同一ソース重複: ${sameSourceDuplicates}件 - 削除推奨`);
  console.log(`⚠️ 要確認: ${needsResolution - sameSourceDuplicates}件`);
  console.log(`合計: ${duplicates.length}件\n`);
}

main();
