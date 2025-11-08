#!/usr/bin/env node

/**
 * 主要成分未登録と報告された商品の成分参照を詳しくチェック
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

// 主要成分未登録と報告された商品のサンプル
const sampleSlugs = [
  "dhc-calcium-mg-60",
  "fancl-40-women-90",
  "8000-1000-off-d-3-1000iu-180-now-foods-vitamin-d-3-1-000-iu-180-softgels",
  "dhc-folic-acid-60",
  "afc-calcium-magnesium-30-3set"
];

async function checkIngredientReferences() {
  console.log("🔍 成分参照の詳細チェック...\n");

  for (const slug of sampleSlugs) {
    const product = await client.fetch(
      `*[_type == "product" && slug.current == $slug][0]{
        _id,
        name,
        ingredients
      }`,
      { slug }
    );

    if (!product) {
      console.log(`⚠️  商品が見つかりません: ${slug}\n`);
      continue;
    }

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`📦 ${product.name.substring(0, 60)}...`);
    console.log(`   Slug: ${slug}\n`);

    if (!product.ingredients || product.ingredients.length === 0) {
      console.log("   ❌ 成分データなし\n");
      continue;
    }

    console.log(`   成分数: ${product.ingredients.length}件\n`);

    // 成分の生データを表示
    product.ingredients.forEach((ing, i) => {
      console.log(`   [${i}] amountMgPerServing: ${ing.amountMgPerServing}mg`);
      console.log(`       ingredient._ref: ${ing.ingredient?._ref || 'なし'}`);
      console.log(`       ingredient._type: ${ing.ingredient?._type || 'なし'}`);
      console.log();
    });

    // 参照解決済みのデータも取得
    const productResolved = await client.fetch(
      `*[_type == "product" && slug.current == $slug][0]{
        ingredients[]{
          amountMgPerServing,
          ingredient->{
            _id,
            name
          }
        }
      }`,
      { slug }
    );

    console.log("   参照解決後:");
    productResolved.ingredients.forEach((ing, i) => {
      console.log(`   [${i}] ${ing.ingredient?.name || '未登録'}: ${ing.amountMgPerServing}mg`);
    });

    console.log("\n");
  }
}

checkIngredientReferences()
  .then(() => {
    console.log("✅ 完了\n");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ エラー:", error);
    process.exit(1);
  });
