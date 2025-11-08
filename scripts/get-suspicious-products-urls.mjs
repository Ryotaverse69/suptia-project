#!/usr/bin/env node

/**
 * 配合量が疑わしい商品のURL一覧を取得
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

const suspiciousSlugs = [
  "50-off-3-d-c-b-a-e-90",
  "p10-10-27-09-59-120-1-d-k",
  "vitas-vitapower-120-c-gmp",
  "test-product-with-ingredients",
  "fancl-d-c-b-a-e-q10",
  "d3k2-d-k-d3-k2-d-k",
  "170-2800iu-d3-crown-1-1-60-d-k-vitamin-d3"
];

async function getProductUrls() {
  console.log("🔍 配合量が疑わしい7件の商品URL一覧\n");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  for (const slug of suspiciousSlugs) {
    const product = await client.fetch(
      `*[_type == "product" && slug.current == $slug][0]{
        _id,
        name,
        source,
        itemCode,
        ingredients[]{
          amountMgPerServing,
          ingredient->{
            name
          }
        }
      }`,
      { slug }
    );

    if (!product) {
      console.log(`❌ ${slug}: 商品が見つかりません\n`);
      continue;
    }

    // URLを構築
    let url = "URL情報なし";
    if (product.source && product.itemCode) {
      if (product.source === 'rakuten') {
        url = `https://item.rakuten.co.jp/${product.itemCode}`;
      } else if (product.source === 'yahoo') {
        url = `https://shopping.yahoo.co.jp/products/${product.itemCode}`;
      }
    }

    // 疑わしい成分を特定
    const suspiciousIngredients = product.ingredients.filter(ing => {
      const name = ing.ingredient.name;
      const amount = ing.amountMgPerServing;

      // ナイアシンが1000mg以上
      if (name.includes('ナイアシン') && amount >= 1000) return true;
      // ビタミンKが1000mg以上
      if (name.includes('ビタミンK') && amount >= 1000) return true;
      // ビタミンDが1mg以上
      if (name.includes('ビタミンD') && amount >= 1) return true;

      return false;
    });

    console.log(`📦 ${product.name.substring(0, 60)}...`);
    console.log(`   Slug: ${slug}`);

    suspiciousIngredients.forEach(ing => {
      console.log(`   ⚠️  ${ing.ingredient.name}: ${ing.amountMgPerServing}mg`);
    });

    console.log(`   URL: ${url}`);
    console.log();
  }
}

getProductUrls()
  .then(() => {
    console.log('✅ 完了');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ エラー:', error);
    process.exit(1);
  });
