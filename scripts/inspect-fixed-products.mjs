#!/usr/bin/env node

/**
 * 修正後の商品の実データを詳細確認
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

async function inspectFixedProducts() {
  console.log("🔍 修正後の商品データを詳細確認中...\n");

  const slug = "fancl-d-c-b-a-e-q10";

  const product = await client.fetch(
    `*[_type == "product" && slug.current == $slug][0]{
      _id,
      name,
      ingredients
    }`,
    { slug }
  );

  console.log(`📦 商品: ${product.name}\n`);
  console.log("成分配列の生データ:\n");
  console.log(JSON.stringify(product.ingredients, null, 2));
}

inspectFixedProducts()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ エラー:", error);
    process.exit(1);
  });
