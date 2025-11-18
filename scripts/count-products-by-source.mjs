#!/usr/bin/env node

/**
 * ECサイト別の商品数をカウントするスクリプト
 */

import { createClient } from "@sanity/client";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, "../apps/web/.env.local") });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.SANITY_API_VERSION || "2024-03-15",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function countProductsBySource() {
  console.log("📊 ECサイト別の商品数をカウント中...\n");

  try {
    // 全商品数
    const totalQuery = `count(*[_type == "product"])`;
    const totalCount = await client.fetch(totalQuery);

    // 楽天商品数
    const rakutenQuery = `count(*[_type == "product" && source == "rakuten"])`;
    const rakutenCount = await client.fetch(rakutenQuery);

    // Yahoo!商品数
    const yahooQuery = `count(*[_type == "product" && source == "yahoo"])`;
    const yahooCount = await client.fetch(yahooQuery);

    // Amazon商品数
    const amazonQuery = `count(*[_type == "product" && source == "amazon"])`;
    const amazonCount = await client.fetch(amazonQuery);

    // iHerb商品数
    const iherbQuery = `count(*[_type == "product" && source == "iherb"])`;
    const iherbCount = await client.fetch(iherbQuery);

    // テスト/その他商品数
    const otherQuery = `count(*[_type == "product" && !defined(source)])`;
    const otherCount = await client.fetch(otherQuery);

    // 結果表示
    console.log("📦 商品数の内訳:");
    console.log("─".repeat(50));
    console.log(`🏪 楽天市場:     ${rakutenCount}件`);
    console.log(`🛒 Yahoo!:       ${yahooCount}件`);
    console.log(`📦 Amazon:       ${amazonCount}件`);
    console.log(`🌿 iHerb:        ${iherbCount}件`);
    console.log(`🧪 テスト/その他: ${otherCount}件`);
    console.log("─".repeat(50));
    console.log(`✅ 合計:         ${totalCount}件\n`);

    // 各ECサイトのサンプル商品を表示
    console.log("📋 各ECサイトのサンプル商品（最新5件）:\n");

    const sources = [
      { name: "楽天市場", key: "rakuten" },
      { name: "Yahoo!", key: "yahoo" },
    ];

    for (const source of sources) {
      const sampleQuery = `*[_type == "product" && source == "${source.key}"] | order(_createdAt desc)[0..4]{
        name,
        priceJPY,
        source,
        itemCode,
        _createdAt
      }`;

      const samples = await client.fetch(sampleQuery);

      console.log(`\n🏪 ${source.name}:`);
      if (samples.length === 0) {
        console.log("  （商品なし）");
      } else {
        samples.forEach((product, index) => {
          console.log(
            `  ${index + 1}. ${product.name} - ¥${product.priceJPY.toLocaleString()}`,
          );
        });
      }
    }

    console.log("\n✅ カウント完了！");
  } catch (error) {
    console.error("❌ エラーが発生しました:", error);
    process.exit(1);
  }
}

countProductsBySource();
