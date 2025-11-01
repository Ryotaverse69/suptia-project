/**
 * 成分データが正しく追加されたか確認するスクリプト
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 環境変数読み込み
const envPath = join(__dirname, "../apps/web/.env.local");
const envContent = readFileSync(envPath, "utf8");

const SANITY_API_TOKEN = envContent
  .match(/SANITY_API_TOKEN=(.+)/)?.[1]
  ?.trim();

if (!SANITY_API_TOKEN) {
  console.error("❌ SANITY_API_TOKEN が見つかりません");
  process.exit(1);
}

// Sanity設定
const SANITY_PROJECT_ID = "fny3jdcg";
const SANITY_DATASET = "production";

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: "2024-01-01",
  token: SANITY_API_TOKEN,
  useCdn: false,
});

async function main() {
  console.log("🔍 成分データが追加された商品を確認中...\n");

  const products = await client.fetch(`
    *[_type == "product" && defined(ingredients)] {
      _id,
      name,
      slug,
      brandName,
      priceJPY,
      "ingredientCount": count(ingredients),
      ingredients[]{
        amountMgPerServing,
        ingredient->{
          _id,
          name,
          slug
        }
      }
    }
  `);

  console.log(`✅ ${products.length}件の商品に成分データが含まれています\n`);

  for (const product of products) {
    console.log("=".repeat(80));
    console.log(`商品: ${product.name || "不明"}`);
    console.log(`ID: ${product._id}`);
    console.log(`slug: ${product.slug?.current || "なし"}`);
    console.log(`ブランド: ${product.brandName || "不明"}`);
    console.log(`価格: ${product.priceJPY ? "¥" + product.priceJPY.toLocaleString() : "なし"}`);
    console.log(`\n成分データ (${product.ingredientCount}件):`);

    for (const ing of product.ingredients) {
      console.log(`  - ${ing.ingredient?.name || "不明"} (${ing.ingredient?.slug?.current || "不明"})`);
      console.log(`    含有量: ${ing.amountMgPerServing}mg/回`);
    }

    console.log("");
  }

  console.log("=".repeat(80));
  console.log("\n✅ 確認完了");
  console.log("\n次のステップ:");
  console.log("  以下のURLで商品ページを確認してください:");
  for (const product of products) {
    if (product.slug?.current) {
      console.log(`  http://localhost:3001/products/${product.slug.current}`);
    }
  }
}

main().catch((error) => {
  console.error("❌ エラー:", error);
  process.exit(1);
});
