#!/usr/bin/env node

/**
 * Sanity商品データチェックスクリプト
 *
 * Sanity CMSに登録されている商品データの状況を確認します。
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

async function checkSanityData() {
  console.log("🔍 Sanity商品データチェックを開始します...\n");

  try {
    // 商品数をカウント
    const productCount = await client.fetch(
      `count(*[_type == "product"])`
    );
    console.log(`📦 商品数: ${productCount}件`);

    // 在庫ありの商品数
    const inStockCount = await client.fetch(
      `count(*[_type == "product" && availability == "in-stock"])`
    );
    console.log(`✅ 在庫あり: ${inStockCount}件`);

    // ブランド数
    const brandCount = await client.fetch(`count(*[_type == "brand"])`);
    console.log(`🏷️  ブランド数: ${brandCount}件`);

    // 成分数
    const ingredientCount = await client.fetch(
      `count(*[_type == "ingredient"])`
    );
    console.log(`🧪 成分数: ${ingredientCount}件\n`);

    // relatedGoalsフィールドを持つ成分数
    const ingredientsWithGoals = await client.fetch(
      `count(*[_type == "ingredient" && defined(relatedGoals) && length(relatedGoals) > 0])`
    );
    console.log(
      `🎯 relatedGoalsを持つ成分: ${ingredientsWithGoals}件 / ${ingredientCount}件`
    );

    // contraindications フィールドを持つ成分数
    const ingredientsWithContraindications = await client.fetch(
      `count(*[_type == "ingredient" && defined(contraindications) && length(contraindications) > 0])`
    );
    console.log(
      `⚠️  contraindictionsを持つ成分: ${ingredientsWithContraindications}件 / ${ingredientCount}件\n`
    );

    if (productCount === 0) {
      console.log("❌ 商品データが登録されていません！");
      console.log(
        "💡 診断機能を動作させるには、商品データの登録が必要です。\n"
      );
      console.log("📝 推奨アクション:");
      console.log(
        "   1. Sanity Studioで商品を手動登録 (npx sanity dev)"
      );
      console.log("   2. テスト用商品データをインポート");
      console.log(
        "   3. 楽天/Amazon APIから商品を自動取得・登録\n"
      );
    } else {
      console.log("✅ 商品データが登録されています！\n");

      // サンプル商品を表示
      const sampleProducts = await client.fetch(
        `*[_type == "product"] | order(_createdAt desc)[0...3] {
          _id,
          name,
          "brand": brand->name,
          priceJPY,
          availability,
          "ingredientCount": count(ingredients)
        }`
      );

      console.log("📋 最新商品サンプル（最大3件）:");
      sampleProducts.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name}`);
        console.log(`      ブランド: ${product.brand || "未設定"}`);
        console.log(`      価格: ¥${product.priceJPY?.toLocaleString()}`);
        console.log(`      在庫: ${product.availability || "未設定"}`);
        console.log(`      成分数: ${product.ingredientCount}個\n`);
      });
    }

    // 診断機能で使用可能な商品数
    const diagnosisReadyCount = await client.fetch(
      `count(*[_type == "product"
        && availability == "in-stock"
        && defined(ingredients)
        && length(ingredients) > 0
      ])`
    );
    console.log(
      `🩺 診断機能で使用可能な商品: ${diagnosisReadyCount}件`
    );

    if (diagnosisReadyCount === 0 && productCount > 0) {
      console.log(
        "⚠️  商品はありますが、診断機能で使用できる商品がありません。"
      );
      console.log("💡 以下を確認してください:");
      console.log('   - availability が "in-stock" になっているか');
      console.log("   - ingredients フィールドに成分が登録されているか\n");
    }
  } catch (error) {
    console.error("❌ エラーが発生しました:", error.message);
    console.error("\n環境変数を確認してください:");
    console.error(`   NEXT_PUBLIC_SANITY_PROJECT_ID: ${env.NEXT_PUBLIC_SANITY_PROJECT_ID || "未設定"}`);
    console.error(`   NEXT_PUBLIC_SANITY_DATASET: ${env.NEXT_PUBLIC_SANITY_DATASET || "未設定"}`);
    console.error(`   SANITY_API_TOKEN: ${env.SANITY_API_TOKEN ? "設定済み" : "未設定"}`);
  }
}

checkSanityData();
