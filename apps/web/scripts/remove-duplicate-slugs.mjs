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
  console.log("🗑️ 重複slugを削除中...\n");

  // 全商品を取得
  const products = await client.fetch(
    `*[_type == "product" && (source == "rakuten" || source == "yahoo")]{
      _id,
      name,
      "slug": slug.current,
      source,
      janCode,
      priceJPY,
      _createdAt
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

  let toDelete = [];
  let janCodeMatches = 0;

  duplicates.forEach(([slug, products]) => {
    const janCodes = products.filter(p => p.janCode).map(p => p.janCode);
    const uniqueJanCodes = [...new Set(janCodes)];
    const sources = products.map(p => p.source);
    const uniqueSources = [...new Set(sources)];

    // JANコードが同じ = 価格比較用の正しい重複、保持
    if (uniqueJanCodes.length === 1 && janCodes.length === products.length) {
      console.log(`✅ 保持: ${slug} (価格比較用、JANコード一致: ${uniqueJanCodes[0]})`);
      janCodeMatches++;
    }
    // 同じソースで重複 = 削除すべき（最古を残して他を削除）
    else if (uniqueSources.length < products.length) {
      // 作成日時でソート（古い順）
      const sorted = products.sort((a, b) => new Date(a._createdAt) - new Date(b._createdAt));
      const toKeep = sorted[0];
      const toRemove = sorted.slice(1);

      console.log(`❌ 削除: ${slug} (同じソース重複)`);
      console.log(`   保持: ${toKeep._id} (${new Date(toKeep._createdAt).toLocaleString()})`);

      toRemove.forEach(p => {
        console.log(`   削除: ${p._id} (${new Date(p._createdAt).toLocaleString()})`);
        toDelete.push(p._id);
      });
    }
  });

  console.log("\n" + "=".repeat(80));
  console.log("📊 削除サマリー");
  console.log("=".repeat(80));
  console.log(`✅ 価格比較用（保持）: ${janCodeMatches}件`);
  console.log(`❌ 削除対象: ${toDelete.length}件`);
  console.log("");

  if (toDelete.length === 0) {
    console.log("✅ 削除すべき重複商品はありません。");
    return;
  }

  console.log("削除を開始します...\n");

  let deleted = 0;
  let failed = 0;

  for (const id of toDelete) {
    try {
      await client.delete(id);
      deleted++;

      if (deleted % 5 === 0) {
        console.log(`進捗: ${deleted}/${toDelete.length}件削除済み...`);
      }
    } catch (error) {
      console.error(`❌ 削除失敗: ${id}`);
      console.error(`   エラー: ${error.message}`);
      failed++;
    }
  }

  console.log("\n" + "=".repeat(80));
  console.log("✅ 削除完了");
  console.log("=".repeat(80));
  console.log(`成功: ${deleted}件`);
  console.log(`失敗: ${failed}件`);

  // 削除後の統計
  const remainingProducts = await client.fetch(
    `count(*[_type == "product" && (source == "rakuten" || source == "yahoo")])`
  );

  const remainingDuplicates = await client.fetch(
    `*[_type == "product" && (source == "rakuten" || source == "yahoo")]{
      "slug": slug.current
    }`
  );

  const slugCounts = remainingDuplicates.reduce((acc, item) => {
    acc[item.slug] = (acc[item.slug] || 0) + 1;
    return acc;
  }, {});

  const stillDuplicated = Object.values(slugCounts).filter(count => count > 1).length;

  console.log("\n📊 削除後の状態:");
  console.log(`商品数: ${remainingProducts}件`);
  console.log(`重複slug: ${stillDuplicated}件（価格比較用のみ）`);
}

main();
