#!/usr/bin/env node

import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, "../apps/web/.env.local") });

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "fny3jdcg";
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const SANITY_API_TOKEN = process.env.SANITY_API_TOKEN;

if (!SANITY_API_TOKEN) {
  console.error("❌ エラー: SANITY_API_TOKEN環境変数が設定されていません");
  process.exit(1);
}

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  token: SANITY_API_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

async function listIngredients() {
  console.log('🔍 Sanityに登録されている成分一覧...\n');

  try {
    const ingredients = await client.fetch(
      `*[_type == "ingredient"] | order(name asc){
        _id,
        name,
        nameEn,
        category,
        evidenceLevel,
        safetyScore
      }`
    );

    console.log(`📊 全${ingredients.length}件の成分が登録されています\n`);

    ingredients.forEach((ing, index) => {
      console.log(`${index + 1}. ${ing.name} (${ing.nameEn})`);
      console.log(`   _id: ${ing._id}`);
      console.log(`   カテゴリ: ${ing.category || '未設定'}`);
      console.log(`   エビデンスレベル: ${ing.evidenceLevel || '未設定'}`);
      console.log(`   安全性スコア: ${ing.safetyScore || '未設定'}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

listIngredients()
  .then(() => {
    console.log('\n✅ 完了');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  });
