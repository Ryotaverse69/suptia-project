#!/usr/bin/env node

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

const products = await client.fetch(
  `*[_type == "product" && availability == "in-stock"] | order(name asc){
    _id,
    name,
    ingredients[]{
      amountMgPerServing,
      ingredient->{
        name
      }
    }
  }`
);

console.log("成分量が0以下の商品の例:\n");

let count = 0;
for (const product of products) {
  if (!product.ingredients) continue;

  for (const ing of product.ingredients) {
    if (!ing.ingredient) continue;
    if (ing.amountMgPerServing > 0) continue;

    console.log(`商品名: ${product.name}`);
    console.log(`成分名: ${ing.ingredient.name}`);
    console.log(`現在の成分量: ${ing.amountMgPerServing}mg`);
    console.log('---');

    count++;
    if (count >= 10) break;
  }
  if (count >= 10) break;
}

console.log(`\n合計: ${count}件の例を表示`);
