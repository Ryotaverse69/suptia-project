#!/usr/bin/env node

/**
 * 未登録の主要成分を分析するスクリプト
 *
 * 目的:
 * 1. どの成分が未登録か特定
 * 2. 各成分がどれくらいの商品で使われているか集計
 * 3. 優先順位を付けて成分記事作成の指針を提供
 */

import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, "../apps/web/.env.local") });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "fny3jdcg",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

async function analyzeUnregisteredIngredients() {
  console.log("🔍 未登録の主要成分を分析中...\n");

  // 全商品の主要成分を取得
  const products = await client.fetch(
    `*[_type == "product" && defined(mainIngredient)]{
      _id,
      name,
      slug,
      mainIngredient,
      "mainIngredientName": mainIngredient->name,
      prices[0]{
        amount,
        source
      }
    }`
  );

  console.log(`📊 主要成分が設定されている商品: ${products.length}件\n`);

  // 未登録の主要成分を抽出（mainIngredientNameがnullの商品）
  const unregisteredProducts = products.filter((p) => !p.mainIngredientName);

  console.log(`⚠️  主要成分が未登録の商品: ${unregisteredProducts.length}件\n`);

  if (unregisteredProducts.length === 0) {
    console.log("✅ 全ての主要成分が登録されています\n");
    return;
  }

  // 主要成分IDでグループ化
  const ingredientMap = new Map();

  for (const product of unregisteredProducts) {
    const ingredientId = product.mainIngredient._ref;

    if (!ingredientMap.has(ingredientId)) {
      ingredientMap.set(ingredientId, {
        id: ingredientId,
        products: [],
      });
    }

    ingredientMap.get(ingredientId).products.push({
      name: product.name,
      slug: product.slug.current,
      price: product.prices?.[0]?.amount || null,
      source: product.prices?.[0]?.source || null,
    });
  }

  // 使用回数順にソート
  const sortedIngredients = Array.from(ingredientMap.values()).sort(
    (a, b) => b.products.length - a.products.length
  );

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📋 未登録成分リスト（使用頻度順）");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  sortedIngredients.forEach((ingredient, index) => {
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`[${index + 1}] 成分ID: ${ingredient.id}`);
    console.log(`    使用商品数: ${ingredient.products.length}件\n`);

    console.log(`    📦 商品一覧:\n`);
    ingredient.products.forEach((product, i) => {
      const priceStr = product.price ? `¥${product.price}` : "価格情報なし";
      const sourceStr = product.source ? `(${product.source})` : "";
      console.log(`       ${i + 1}. ${product.name.substring(0, 60)}...`);
      console.log(`          slug: ${product.slug}`);
      console.log(`          価格: ${priceStr} ${sourceStr}\n`);
    });
  });

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📊 統計情報");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  console.log(`未登録の成分種類: ${sortedIngredients.length}種類`);
  console.log(`影響を受ける商品: ${unregisteredProducts.length}件\n`);

  // 優先順位の提案
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("💡 成分記事作成の優先順位");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  const highPriority = sortedIngredients.filter((ing) => ing.products.length >= 5);
  const mediumPriority = sortedIngredients.filter(
    (ing) => ing.products.length >= 2 && ing.products.length < 5
  );
  const lowPriority = sortedIngredients.filter((ing) => ing.products.length === 1);

  console.log(`🔴 高優先度（5商品以上）: ${highPriority.length}件`);
  highPriority.forEach((ing) => {
    console.log(`   - ${ing.id} (${ing.products.length}商品)`);
  });
  console.log();

  console.log(`🟡 中優先度（2〜4商品）: ${mediumPriority.length}件`);
  mediumPriority.forEach((ing) => {
    console.log(`   - ${ing.id} (${ing.products.length}商品)`);
  });
  console.log();

  console.log(`🟢 低優先度（1商品のみ）: ${lowPriority.length}件`);
  lowPriority.forEach((ing) => {
    console.log(`   - ${ing.id} (${ing.products.length}商品)`);
  });
  console.log();

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🎯 次のアクション");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  console.log("1. 高優先度の成分から順に記事を作成");
  console.log("2. 成分記事をSanityにインポート");
  console.log("3. 商品の主要成分参照を正しい成分IDに更新\n");

  // JSONレポート出力
  const report = {
    summary: {
      totalProducts: products.length,
      unregisteredProducts: unregisteredProducts.length,
      unregisteredIngredients: sortedIngredients.length,
    },
    priority: {
      high: highPriority.map((ing) => ({
        id: ing.id,
        productCount: ing.products.length,
        products: ing.products,
      })),
      medium: mediumPriority.map((ing) => ({
        id: ing.id,
        productCount: ing.products.length,
        products: ing.products,
      })),
      low: lowPriority.map((ing) => ({
        id: ing.id,
        productCount: ing.products.length,
        products: ing.products,
      })),
    },
    allIngredients: sortedIngredients.map((ing) => ({
      id: ing.id,
      productCount: ing.products.length,
      products: ing.products,
    })),
  };

  const fs = await import("fs");
  fs.writeFileSync(
    join(__dirname, "unregistered-ingredients-report.json"),
    JSON.stringify(report, null, 2)
  );
  console.log("📄 詳細レポートを保存しました: scripts/unregistered-ingredients-report.json\n");
}

analyzeUnregisteredIngredients()
  .then(() => {
    console.log("✅ スクリプト完了\n");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ エラーが発生しました:", error);
    process.exit(1);
  });
