#!/usr/bin/env node

/**
 * 成分リスト取得スクリプト
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env.localを手動でパース
const envPath = join(__dirname, "../apps/web/.env.local");
const envFile = readFileSync(envPath, "utf-8");
const env = {};
envFile.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim();
  }
});

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-07-01",
  useCdn: false,
  token: env.SANITY_API_TOKEN,
});

async function listIngredients() {
  try {
    const ingredients = await client.fetch(
      `*[_type == "ingredient"] | order(name asc) {
        _id,
        name,
        nameEn,
        "slug": slug.current,
        category,
        evidenceLevel,
        relatedGoals,
        contraindications
      }`
    );

    console.log(`\n📋 成分一覧（${ingredients.length}件）\n`);

    ingredients.forEach((ing, index) => {
      console.log(`${index + 1}. ${ing.name} (${ing.nameEn})`);
      console.log(`   カテゴリ: ${ing.category || "未設定"}`);
      console.log(`   エビデンス: ${ing.evidenceLevel || "未設定"}`);
      console.log(
        `   健康目標: ${ing.relatedGoals?.length || 0}個${ing.relatedGoals?.length > 0 ? ` (${ing.relatedGoals.join(", ")})` : ""}`
      );
      console.log(
        `   禁忌タグ: ${ing.contraindications?.length || 0}個${ing.contraindications?.length > 0 ? ` (${ing.contraindications.join(", ")})` : ""}`
      );
      console.log(`   Slug: ${ing.slug}`);
      console.log(`   ID: ${ing._id}\n`);
    });

    // カテゴリ別集計
    const categoryStats = ingredients.reduce((acc, ing) => {
      const cat = ing.category || "未分類";
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

    console.log("\n📊 カテゴリ別統計:");
    Object.entries(categoryStats)
      .sort((a, b) => b[1] - a[1])
      .forEach(([category, count]) => {
        console.log(`   ${category}: ${count}件`);
      });
  } catch (error) {
    console.error("❌ エラー:", error.message);
  }
}

listIngredients();
