#!/usr/bin/env node

/**
 * オーガランド フォルスコリ商品の成分を更新
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

async function updateProduct() {
  console.log("📦 オーガランド フォルスコリの成分を更新中...\n");

  // slug: sale-1の商品を取得
  const product = await client.fetch(
    `*[_type == "product" && slug.current == $slug][0]{_id, name, priceJPY, servingsPerDay}`,
    { slug: "sale-1" }
  );

  if (!product) {
    console.log("❌ 商品が見つかりません");
    process.exit(1);
  }

  console.log("商品名:", product.name);
  console.log("価格:", product.priceJPY, "円");
  console.log("1日摂取回数:", product.servingsPerDay, "回\n");

  // 成分を更新（フォルスコリエキス200mg/日と推定）
  const newIngredients = [
    {
      _key: `ingredient-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      amountMgPerServing: 200,
      ingredient: {
        _ref: "ingredient-coleus-forskohlii",
        _type: "reference",
      },
    },
  ];

  await client.patch(product._id).set({ ingredients: newIngredients }).commit();

  console.log("✅ 成分を更新しました:");
  console.log("   主要成分: コレウスフォルスコリエキス（フォルスコリン）");
  console.log("   配合量: 200mg/日\n");
}

updateProduct()
  .then(() => {
    console.log("✅ 完了\n");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ エラー:", error);
    process.exit(1);
  });
