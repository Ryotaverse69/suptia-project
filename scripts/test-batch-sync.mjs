#!/usr/bin/env node

/**
 * バッチ価格同期APIテストスクリプト
 *
 * Sanityから商品を取得し、バッチ同期APIをテストします。
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env.localを手動でパース
const envPath = join(__dirname, "../apps/web/.env.local");
const envFile = readFileSync(envPath, "utf-8");
const env = {};
envFile.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim();
  }
});

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-07-01",
  useCdn: false,
  token: env.SANITY_API_TOKEN,
});

async function testBatchSync() {
  console.log("🧪 バッチ価格同期APIをテストします...\n");

  try {
    // Sanityから商品を取得（最大3件）
    const products = await client.fetch(
      `*[_type == "product" && availability == "in-stock"][0...3] {
        _id,
        name,
        "brand": brand->name
      }`
    );

    if (products.length === 0) {
      console.log("❌ 商品データがありません。");
      return;
    }

    console.log(`📦 テスト対象商品: ${products.length}件\n`);
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} (${product.brand})`);
    });
    console.log("");

    // バッチ同期リクエストを構築
    const batchRequest = {
      products: products.map((product) => ({
        id: product._id,
        identifier: {
          // テスト用にタイトルのみ使用
          title: product.name,
        },
      })),
      maxConcurrency: 3,
    };

    console.log("🚀 バッチ同期APIを呼び出します...\n");

    // APIを呼び出し
    const response = await fetch("http://localhost:3000/api/sync/batch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: env.BATCH_SYNC_TOKEN ? `Bearer ${env.BATCH_SYNC_TOKEN}` : "",
      },
      body: JSON.stringify(batchRequest),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("❌ APIエラー:", result);
      return;
    }

    console.log("✅ バッチ同期完了！\n");
    console.log("📊 結果サマリー:");
    console.log(`   総商品数: ${result.totalProducts}件`);
    console.log(`   成功: ${result.successCount}件`);
    console.log(`   失敗: ${result.failureCount}件`);
    console.log(`   実行時間: ${result.duration}ms\n`);

    console.log("📋 詳細結果:\n");
    result.results.forEach((res, index) => {
      const product = products.find((p) => p._id === res.productId);
      console.log(`${index + 1}. ${product?.name || res.productId}`);
      console.log(`   ステータス: ${res.success ? "✅ 成功" : "❌ 失敗"}`);

      if (res.prices && res.prices.length > 0) {
        console.log(`   取得価格 (${res.prices.length}件):`);
        res.prices.forEach((price) => {
          console.log(
            `     - ${price.source}: ¥${price.amount.toLocaleString()} (${price.currency})`
          );
          console.log(`       URL: ${price.url}`);
        });
      }

      if (res.errors && res.errors.length > 0) {
        console.log(`   エラー (${res.errors.length}件):`);
        res.errors.forEach((error) => {
          console.log(`     - ${error.source}: ${error.message}`);
        });
      }
      console.log("");
    });

    console.log("\n💡 次のステップ:");
    console.log("   1. Vercel Cronで定期実行を設定");
    console.log("   2. Sanityに価格データを保存する処理を追加");
    console.log("   3. 価格履歴の記録\n");
  } catch (error) {
    console.error("❌ エラー:", error.message);
    console.error(error.stack);
  }
}

testBatchSync();
