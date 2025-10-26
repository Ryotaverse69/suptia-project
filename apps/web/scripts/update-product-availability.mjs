#!/usr/bin/env node

/**
 * 既存の楽天商品データにavailabilityフィールドを追加するスクリプト
 */

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
  console.warn("⚠️ .env.localファイルが見つかりません。環境変数を確認してください。");
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.SANITY_API_VERSION || "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

/**
 * メイン処理
 */
async function main() {
  console.log("🚀 楽天商品のavailabilityフィールドを更新します\n");

  try {
    // 1. source == "rakuten"でavailabilityが設定されていない商品を取得
    console.log("📊 更新対象の商品を取得中...\n");

    const products = await client.fetch(
      `*[_type == "product" && source == "rakuten" && !defined(availability)]{
        _id,
        name,
        itemCode
      }`
    );

    console.log(`✅ ${products.length}件の商品が見つかりました\n`);

    if (products.length === 0) {
      console.log("✨ すべての楽天商品にavailabilityが設定されています！");
      return;
    }

    // 2. 各商品を更新
    let updatedCount = 0;

    for (const [index, product] of products.entries()) {
      console.log(
        `[${index + 1}/${products.length}] 📝 更新中: ${product.name.substring(0, 50)}...`
      );

      try {
        await client
          .patch(product._id)
          .set({ availability: "in-stock" })
          .commit();

        updatedCount++;
        console.log(`  ✅ 更新完了`);

        // APIレート制限対策: 100msの待機
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`  ❌ エラー: ${error.message}`);
        continue;
      }
    }

    console.log("\n" + "=".repeat(80));
    console.log(`✨ 完了！${updatedCount}/${products.length}件の商品を更新しました`);
    console.log("=".repeat(80));
  } catch (error) {
    console.error("❌ エラーが発生しました:", error.message);
    process.exit(1);
  }
}

// 実行
main();
