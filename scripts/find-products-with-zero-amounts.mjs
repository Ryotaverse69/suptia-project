#!/usr/bin/env node

/**
 * 配合量0mgの商品を特定
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

console.log("🔍 配合量0mgの商品を検索\n");

const products = await client.fetch(
  `*[_type == "product" && availability == "in-stock"] {
    _id,
    name,
    slug,
    source,
    itemCode,
    ingredients[]{\
      amountMgPerServing,
      ingredient->{\
        name
      }
    }
  }`
);

const zeroAmountProducts = products.filter(p => {
  if (!p.ingredients || p.ingredients.length === 0) return false;
  return p.ingredients.some(ing => 
    ing.ingredient && (ing.amountMgPerServing === 0 || ing.amountMgPerServing === null || ing.amountMgPerServing === undefined)
  );
});

console.log(`📦 配合量0mgの成分を含む商品: ${zeroAmountProducts.length}件\n`);

if (zeroAmountProducts.length === 0) {
  console.log("✅ すべての商品に配合量データが設定されています\n");
} else {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  zeroAmountProducts.forEach((p, index) => {
    console.log(`${index + 1}. ${p.name.substring(0, 70)}...`);
    console.log(`   Slug: ${p.slug.current}`);
    console.log(`   ソース: ${p.source || "不明"}`);
    
    if (p.source === 'rakuten') {
      console.log(`   楽天URL: https://item.rakuten.co.jp/${p.itemCode}`);
    }

    console.log(`   配合量0mgの成分:`);
    p.ingredients
      .filter(ing => ing.ingredient && (ing.amountMgPerServing === 0 || ing.amountMgPerServing === null || ing.amountMgPerServing === undefined))
      .forEach(ing => {
        console.log(`      - ${ing.ingredient.name}: ${ing.amountMgPerServing || "未設定"}`);
      });
    console.log();
  });

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("💡 対策");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  console.log("1. 楽天APIから商品データを再同期");
  console.log("2. 商品ページで栄養成分表を確認");
  console.log("3. 配合量を手動で入力\n");
}
