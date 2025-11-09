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
  `*[_type == "product" && availability == "in-stock"] {
    _id,
    name,
    slug,
    ingredients[]{\
      ingredient->{\
        _id,
        name,
        evidenceLevel,
        safetyScore
      }
    }
  }`
);

products.forEach(product => {
  if (!product.ingredients || product.ingredients.length === 0) return;
  const mainIng = product.ingredients[0];
  if (!mainIng.ingredient) return;
  
  if (!mainIng.ingredient.evidenceLevel || !mainIng.ingredient.safetyScore) {
    console.log(`❌ ${product.name}`);
    console.log(`   Slug: ${product.slug.current}`);
    console.log(`   主要成分: ${mainIng.ingredient.name}`);
    console.log(`   エビデンスレベル: ${mainIng.ingredient.evidenceLevel || "未設定"}`);
    console.log(`   安全性スコア: ${mainIng.ingredient.safetyScore || "未設定"}\n`);
  }
});
